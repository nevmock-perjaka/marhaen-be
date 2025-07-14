import crypto from "crypto";
import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";
import { userMidtransConfig } from "../../config/midtrans.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import { decrypt } from "../../utils/hash.js";
import orderQueryConfig from "./order-query-config.js";

class OrderService {
	async findAll(userId, query) {
		const options = buildQueryOptions(orderQueryConfig, query, userId);

		const [data, count] = await Promise.all([
			db.order.findMany(options),
			db.order.count({
				where: options.where,
			}),
		]);

		const currentPage = query?.pagination?.page ?? 1;
		const itemsPerPage = query?.pagination?.limit ?? 10;
		const totalPages = Math.ceil(count / itemsPerPage);

		return {
			data,
			meta:
				query?.pagination?.page && query?.pagination?.limit
					? {
							totalItems: count,
							totalPages,
							currentPage,
							itemsPerPage,
						}
					: null,
			count: data.length,
		};
	}

	async findById(orderId) {
		const order = await db.order.findUnique({
			where: { id: orderId },
			include: {
				table: true,
				discount: true,
				Order_item: {
					include: {
						product: true,
						Order_item_add_on: {
							include: {
								add_on: true,
							},
						},
					},
				},
				Order_transaction: true,
			},
		});

		if (!order) throw BaseError.notFound("Order not found.");

		return order;
	}

	async create(data, strict_mode = false) {
		return db.$transaction(async (tx) => {
			const midtransConfig = await tx.midtrans_User.findUnique({
				where: { user_id: data.owned_by },
			});

			if (!midtransConfig)
				throw BaseError.badRequest(
					"Midtrans configuration not found for this user.",
				);
			if (!midtransConfig.server_key || !midtransConfig.client_key)
				throw BaseError.badRequest(
					"Midtrans server key or client key is not set.",
				);

			const activeShift = await tx.staff_log.findFirst({
				where: {
					owned_by: data.owned_by,
					end_timestamp: null, // Hanya ambil yang belum clock out
				},
				orderBy: { start_timestamp: "desc" },
			});

			if (!activeShift)
				throw BaseError.badRequest(
					"You must clock in first before creating an order.",
				);

			data.staff_id = activeShift.staff_id;

			const tableExists = data.table_id
				? await tx.table.findUnique({
						where: { id: data.table_id },
					})
				: null;

			if (data.table_id && !tableExists)
				throw BaseError.notFound("Table not found.");
			if (data.table_id && tableExists.owned_by !== data.owned_by)
				throw BaseError.forbidden("You are not allowed to access this table.");
			if (data.table_id && !tableExists.is_active)
				throw BaseError.badRequest(
					"Table is not active. Please activate the table first.",
				);

			const discountExists = data.shareable_code
				? await tx.discount.findFirst({
						where: {
							shareable_code: data.shareable_code,
							owned_by: data.owned_by,
						},
					})
				: null;

			const timeNow = new Date();

			// Checking Discount
			if (data.shareable_code && !discountExists)
				throw BaseError.notFound("Discount not found.");
			if (data.shareable_code && !discountExists.is_active)
				throw BaseError.badRequest(
					"Discount is not active. Please activate the discount first.",
				);
			if (data.shareable_code && timeNow < new Date(discountExists.start_at))
				throw BaseError.badRequest("Discount is not yet active.");
			if (data.shareable_code && timeNow > new Date(discountExists.expired_at))
				throw BaseError.badRequest("Discount has expired.");
			if (data.shareable_code && discountExists.used >= discountExists.max_use)
				throw BaseError.badRequest(
					"Discount has reached its maximum usage limit.",
				);

			const productIds = [
				...new Set(data.order_items.map((item) => item.product_id)),
			];

			const productExists = await tx.product.findMany({
				where: {
					id: { in: productIds },
					owned_by: data.owned_by,
				},
				include: {
					Add_on_group: {
						include: {
							Add_on: true,
						},
					},
				},
			});

			if (productExists.length !== productIds.length)
				throw BaseError.badRequest(
					"Some products do not exist or are not owned by the user.",
				);

			// Check if the add-ons exist and are owned by the user
			const addOnIds = [
				...new Set(
					data.order_items.flatMap((item) => item.order_item_add_ons || []),
				),
			];

			// Ambil semua add_on beserta info grupnya (untuk cek product_id)
			const addOns = await tx.add_on.findMany({
				where: {
					id: { in: addOnIds },
					owned_by: data.owned_by,
				},
				include: {
					add_on_group: true, // supaya dapat product_id dari group-nya
				},
			});

			if (addOns.length !== addOnIds.length)
				throw BaseError.badRequest(
					"Some add-ons do not exist or are not owned by the user.",
				);

			// Mapping add_on_id → product_id yang seharusnya
			const addOnToProductMap = new Map(
				addOns.map((addOn) => [addOn.id, addOn.add_on_group.product_id]),
			);

			for (const item of data.order_items) {
				const product = productExists.find((p) => p.id === item.product_id);
				const selectedAddOns = item.order_item_add_ons || [];

				// Ambil semua group add_on untuk product ini
				const addOnGroups = product.Add_on_group;

				for (const group of addOnGroups) {
					const addOnsInGroup = group.Add_on.map((a) => a.id);
					const selectedInGroup = selectedAddOns.filter((id) =>
						addOnsInGroup.includes(id),
					);

					// 🛑 Cek max_selection
					if (selectedInGroup.length > group.max_selection) {
						throw BaseError.badRequest(
							`Too many add-ons selected for group '${group.name}' in product '${product.name}'. Max allowed: ${group.max_selection}.`,
						);
					}

					// 🛑 Cek is_required
					if (group.is_required && selectedInGroup.length === 0) {
						throw BaseError.badRequest(
							`Add-on group '${group.name}' is required for product '${product.name}' but none were selected.`,
						);
					}
				}
			}

			// Validasi: pastikan semua order_item_add_ons sesuai dengan product_id parent-nya
			for (const item of data.order_items) {
				for (const addOnId of item.order_item_add_ons || []) {
					const expectedProductId = addOnToProductMap.get(addOnId);
					if (!expectedProductId) {
						throw BaseError.badRequest(
							`Add-on ${addOnId} not found or not owned by the user.`,
						);
					}
					if (expectedProductId !== item.product_id) {
						throw BaseError.badRequest(
							`Add-on ${addOnId} does not belong to product ${item.product_id}.`,
						);
					}
				}
			}

			const orderItems = data.order_items.map((item) => {
				const product = productExists.find((p) => p.id === item.product_id);
				return {
					product_id: item.product_id,
					quantity: item.quantity,
					price: product.price,
					note: item.note,
					created_by: data.created_by,
					updated_by: data.updated_by,
					owned_by: data.owned_by,
					Order_item_add_on: {
						create: item.order_item_add_ons
							? item.order_item_add_ons.map((addOnId) => {
									let matchedAddOn = null;

									for (const group of product.Add_on_group) {
										matchedAddOn = group.Add_on.find((a) => a.id === addOnId);
										if (matchedAddOn) break;
									}

									if (!matchedAddOn) {
										throw BaseError.badRequest(
											`Add-on ${addOnId} tidak ditemukan untuk product ${product.id}`,
										);
									}

									return {
										add_on_id: matchedAddOn.id,
										price: matchedAddOn.price,
										created_by: data.created_by,
										updated_by: data.updated_by,
										owned_by: data.owned_by,
									};
								})
							: [],
					},
				};
			});

			if (strict_mode) {
				for (const item of data.order_items) {
					const productConfigs = await tx.product_config.findMany({
						where: {
							product_id: item.product_id,
						},
					});

					for (const config of productConfigs) {
						let requiredQuantity = config.value * item.quantity;

						// Validasi stock global dulu
						const totalStock = await tx.input_history.aggregate({
							_sum: {
								current_stock: true,
							},
							where: {
								inventory_id: config.inventory_id,
								owned_by: data.owned_by,
							},
						});

						if ((totalStock._sum?.current_stock || 0) < requiredQuantity) {
							throw BaseError.badRequest(
								`Insufficient stock for inventory '${config.inventory_id}' used in product '${item.product_id}'. Required: ${requiredQuantity}, Available: ${totalStock._sum?.current_stock || 0}`,
							);
						}

						// Loop pengurangan stok dari input_history satu per satu
						const inputHistories = await tx.input_history.findMany({
							where: {
								inventory_id: config.inventory_id,
								owned_by: data.owned_by,
								current_stock: { gt: 0 },
							},
							orderBy: {
								created_at: "asc", // FIFO: Kurangi dari yang paling lama dulu
							},
						});

						for (const input of inputHistories) {
							if (requiredQuantity === 0) break;

							const toDeduct = Math.min(requiredQuantity, input.current_stock);

							await tx.input_history.update({
								where: { id: input.id },
								data: {
									current_stock: { decrement: toDeduct },
									updated_by: data.updated_by,
								},
							});

							requiredQuantity -= toDeduct;

							// Optional: bisa log pengurangan ini ke table Stock_log jika diperlukan
						}
					}
				}
			}

			let total_gross = orderItems.reduce((total, item) => {
				const itemTotal = item.price;
				const addOnTotal = item.Order_item_add_on.create.reduce(
					(sum, addOn) => sum + addOn.price,
					0,
				);
				return total + (itemTotal + addOnTotal) * item.quantity;
			}, 0);

			let discount = 0;

			if (discountExists) {
				if (total_gross < discountExists.min_order_amount)
					throw BaseError.badRequest(
						`Total order must be at least ${discountExists.min_order_amount} to apply this discount.`,
					);

				if (discountExists.is_percentage) {
					discount = total_gross * (discountExists.value / 100);
					if (discount > discountExists.max_discount) {
						discount = discountExists.max_discount;
					}
				} else {
					discount = discountExists.value;
				}

				total_gross -= discount;
			}

			const siteConfig = await tx.site_config.findFirst();

			const value = {
				order_by: data.order_by,
				status: "Not Paid",
				total_gross: total_gross,
				phone_number: data.phone_number,
				table_id: data.table_id,
				discount_id: discountExists ? discountExists.id : null,
				staff_id: data.staff_id,
				owned_by: data.owned_by,
				created_by: data.created_by,
				updated_by: data.updated_by,
				Order_item: {
					create: orderItems,
				},
				Order_transaction: {
					create: {
						is_production: midtransConfig.is_production,
						owned_by: data.owned_by,
						created_by: data.created_by,
						updated_by: data.updated_by,
					},
				},
			};

			const order = await tx.order.create({
				data: value,
				include: {
					table: true,
					discount: true,
					Order_item: {
						include: {
							product: true,
							Order_item_add_on: {
								include: {
									add_on: true,
								},
							},
						},
					},
					Order_transaction: true,
				},
			});

			const item_details = order.Order_item.map((item) => {
				const addOnTotal = item.Order_item_add_on.reduce(
					(sum, addOn) => sum + addOn.price,
					0,
				);
				return {
					id: item.product_id,
					price: item.price + addOnTotal,
					quantity: item.quantity,
					name: `${item.product.name}${item.Order_item_add_on.length > 0 ? ` with ` : ``}${item.Order_item_add_on.map(
						(addOn) => addOn.add_on.name,
					).join(", ")}`,
				};
			});

			if (data.shareable_code && discountExists) {
				item_details.push({
					id: discountExists.shareable_code,
					price: -discount,
					quantity: 1,
					name: `Discount ${discountExists.shareable_code || "Applied"}`,
				});
			}

			const parameter = {
				transaction_details: {
					order_id: order.Order_transaction[0].id,
					gross_amount: order.total_gross,
				},
				credit_card: {
					secure: true,
				},
				customer_details: {
					first_name: order.order_by,
					phone: order.phone_number,
				},
				enabled_payments: ["other_qris"],
				item_details: item_details,
				metadata: {
					type: "order",
					id: order.id,
					credentials: value.owned_by,
				},
				expiry: {
					unit: "minutes",
					duration: 5,
				},
			};

			let snap;

			try {
				snap = await userMidtransConfig(
					midtransConfig.is_production,
					midtransConfig.server_key,
					midtransConfig.client_key,
				).createTransaction(parameter);
			} catch (error) {
				console.error(
					"Midtrans transaction creation failed:",
					error.ApiResponse,
				);
				throw BaseError.serviceUnavailable(
					"Failed to create Midtrans transaction. Please try again later.",
				);
			}

			if (!snap)
				throw BaseError.serviceUnavailable(
					"Midtrans service is currently unavailable. Please try again later.",
				);

			await tx.order_transaction.update({
				where: {
					id: order.Order_transaction[0].id,
				},
				data: {
					admin_fee: order.total_gross * 0.007, // Misalkan admin fee adalah 0.7% dari total gross
					ppn_percentage: siteConfig.ppn_percentage, // PPN Diambil dari site config
					ppn_fee: order.total_gross * (siteConfig.ppn_percentage / 100), // PPN fee dihitung dari total gross
					transaction_token: snap.token,
					redirect_url: snap.redirect_url,
					gross_amount: order.total_gross,
				},
			});

			if (value.shareable_code && discountExists) {
				await tx.discount.update({
					where: {
						id: discountExists.id,
					},
					data: {
						used: {
							increment: 1,
						},
						updated_by: data.updated_by,
					},
				});
			}

			snap.id = order.id;

			return snap;
		});
	}

	async update(orderId, data) {
		return await db.order.update({
			where: { id: orderId },
			data,
		});
	}

	async delete(orderId) {
		return await db.order.delete({
			where: { id: orderId },
		});
	}

	async updateWebhookMidtrans(data) {
		console.info(
			"✅ Transaction notification received. Order ID:",
			data.order_id,
			"Transaction status:",
			data.transaction_status,
			"Fraud status:",
			data.fraud_status,
		);
		const user = await db.user.findUnique({
			where: { id: data.metadata.credentials },
		});

		if (!user) throw BaseError.badRequest("User not found");

		const user_midtrans = await db.midtrans_User.findUnique({
			where: { user_id: user.id },
		});

		if (!user_midtrans)
			throw BaseError.badRequest(
				"Midtrans configuration not found for this user.",
			);
		if (!user_midtrans.server_key || !user_midtrans.client_key)
			throw BaseError.badRequest(
				"Midtrans server key or client key is not set.",
			);

		const hash = crypto
			.createHash("sha512")
			.update(
				`${data.order_id}${data.status_code}${data.gross_amount}${decrypt(user_midtrans.server_key)}`,
			)
			.digest("hex");

		if (data.signature_key !== hash)
			throw BaseError.badRequest("Invalid signature key");

		const orderTransaction = await db.order_transaction.findUnique({
			where: {
				id: data.order_id,
			},
			include: {
				order: {
					include: {
						discount: true,
					},
				},
			},
		});

		if (!orderTransaction)
			throw BaseError.badRequest("Order transaction not found");
		if (orderTransaction.owned_by !== user.id)
			throw BaseError.forbidden(
				"You are not allowed to access this order transaction.",
			);

		const order = await db.order.findUnique({
			where: { id: data.metadata.id },
		});

		if (!order) throw BaseError.badRequest("Order not found");
		if (order.owned_by !== user.id)
			throw BaseError.forbidden("You are not allowed to access this order.");

		if (data.transaction_status === "capture") {
			if (data.fraud_status === "accept") {
				await db.order_transaction.update({
					where: {
						id: orderTransaction.id,
					},
					data: {
						status: data.transaction_status,
						updated_by: "system",
					},
				});

				await db.order.update({
					where: { id: order.id },
					data: {
						status: "Paid",
						updated_by: "system",
					},
				});
			}
		} else if (data.transaction_status === "settlement") {
			await db.order_transaction.update({
				where: { id: orderTransaction.id },
				data: {
					status: data.transaction_status,
					updated_by: "system",
				},
			});

			await db.order.update({
				where: { id: order.id },
				data: {
					status: "Paid",
					updated_by: "system",
				},
			});
		} else if (
			data.transaction_status === "cancel" ||
			data.transaction_status === "deny" ||
			data.transaction_status === "expire"
		) {
			await db.order_transaction.update({
				where: {
					id: orderTransaction.id,
				},
				data: {
					status: data.transaction_status,
					updated_by: "system",
				},
			});

			await db.order.delete({
				where: { id: order.id },
			});

			await db.discount.update({
				where: {
					id: orderTransaction.order.discount_id,
				},
				data: {
					used: {
						decrement: 1,
					},
					updated_by: "system",
				},
			});
		} else if (data.transaction_status === "pending") {
			await db.order_transaction.update({
				where: {
					id: orderTransaction.id,
				},
				data: {
					transaction_id: data.transaction_id,
					status: data.transaction_status,
					payment_method: data.payment_type,
					updated_by: "system",
				},
			});
		}

		return true;
	}
}

export default new OrderService();
