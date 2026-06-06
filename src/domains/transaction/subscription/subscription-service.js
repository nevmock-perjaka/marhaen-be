// import BaseError from '../../../base_classes/base-error.js';
import BaseError from "../../../base_classes/base-error.js";
import db from "../../../config/db.js";
import { midtransSnap } from "../../../config/midtrans.js";

class SubscriptionService {
	async createSnap(plan_id, user) {
		return db.$transaction(async (tx) => {
			const plan = await tx.plan.findUnique({
				where: {
					id: plan_id,
				},
			});

			if (!plan) {
				throw BaseError.badRequest("Plan not found");
			}

			const subscription_transaction = await tx.subscription_transaction.create(
				{
					data: {
						user_id: user.id,
						level: plan.level,
						days: plan.days,
						level_name: plan.name,
					},
				},
			);

			if (!subscription_transaction) {
				throw BaseError.badRequest("Failed to create subscription transaction");
			}

			const site_config = await tx.site_config.findFirst();

			if (!site_config)
				throw BaseError.badRequest("Site configuration not found");

			const adminFee = Math.ceil(plan.price * 0.007);
			const taxFee = Math.ceil((plan.price * site_config.ppn_percentage) / 100);
			const grossAmount = plan.price + adminFee + taxFee;

			const parameter = {
				transaction_details: {
					order_id: subscription_transaction.id,
					gross_amount: grossAmount,
				},
				credit_card: {
					secure: true,
				},
				customer_details: {
					first_name: user.name,
					email: user.email,
					phone: user.phone_number,
				},
				enabled_payments: ["other_qris"],
				item_details: [
					{
						id: plan.id,
						price: plan.price,
						quantity: 1,
						name: `${plan.name} ${plan.days} Days`,
					},
					{
						id: "admin_fee",
						price: adminFee,
						quantity: 1,
						name: "Admin Fee",
					},
					{
						id: "tax_fee",
						price: taxFee,
						quantity: 1,
						name: "Tax Fee",
					},
				],
				metadata: {
					type: "subscription",
					id: subscription_transaction.id,
				},
			};

			const snap = await midtransSnap.createTransaction(parameter);

			if (!snap) {
				throw new Error("Failed to create snap");
			}

			await tx.subscription_transaction.update({
				where: {
					id: subscription_transaction.id,
				},
				data: {
					transaction_token: snap.token,
					redirect_url: snap.redirect_url,
					gross_amount: grossAmount,
					admin_fee: adminFee,
					ppn_fee: taxFee,
					ppn_percentage: site_config.ppn_percentage,
				},
			});

			return snap;
		});
	}

	async updateSubscriptionTransaction(data) {
		const subscription_transaction =
			await db.subscription_transaction.findUnique({
				where: {
					id: data.metadata.id,
				},
			});
		console.log(
			`Transaction notification received. Order ID: ${data.order_id}. Transaction status: ${data.transaction_status}. Fraud status: ${data.fraud_status}`,
		);

		if (!subscription_transaction) {
			throw BaseError.badRequest("Subscription transaction not found");
		}

		if (data.transaction_status === "capture") {
			if (data.fraud_status === "accept") {
				await db.subscription_transaction.update({
					where: {
						id: subscription_transaction.id,
					},
					data: {
						status: data.transaction_status,
						paid_at: new Date(),
					},
				});

				const user = await db.user.findUnique({
					where: {
						id: subscription_transaction.user_id,
					},
				});

				const new_expired_date = () => {
					const now = new Date();
					const daysToMs = subscription_transaction.days * 24 * 60 * 60 * 1000;

					return new Date(now.getTime() + daysToMs);
				};

				await db.user.update({
					where: {
						id: user.id,
					},
					data: {
						subs_level: subscription_transaction.level,
						subs_expired_at: new_expired_date(),
					},
				});
			}
		} else if (data.transaction_status === "settlement") {
			await db.subscription_transaction.update({
				where: {
					id: subscription_transaction.id,
				},
				data: {
					status: data.transaction_status,
					paid_at: new Date(),
				},
			});
			const user = await db.user.findUnique({
				where: {
					id: subscription_transaction.user_id,
				},
			});

			const new_expired_date = () => {
				const now = new Date();
				const daysToMs = subscription_transaction.days * 24 * 60 * 60 * 1000;
				return new Date(now.getTime() + daysToMs);
			};

			await db.user.update({
				where: {
					id: user.id,
				},
				data: {
					subs_level: subscription_transaction.level,
					subs_expired_at: new_expired_date(),
				},
			});
		} else if (
			data.transaction_status === "cancel" ||
			data.transaction_status === "deny" ||
			data.transaction_status === "expire"
		) {
			await db.subscription_transaction.update({
				where: {
					id: subscription_transaction.id,
				},
				data: {
					status: data.transaction_status,
				},
			});
		} else if (data.transaction_status === "pending") {
			await db.subscription_transaction.update({
				where: {
					id: subscription_transaction.id,
				},
				data: {
					order_id: data.transaction_id,
					status: data.transaction_status,
					payment_method: data.payment_type,
				},
			});
		}

		return true;
	}

	async findAll(userId) {
		return db.subscription_transaction.findMany({
			where: {
				user_id: userId,
				status: {
					in: ["capture", "settlement"],
				},
			},
			orderBy: {
				created_at: "desc",
			},
			select: {
				id: true,
				level: true,
				days: true,
				level_name: true,
				paid_at: true,
				created_at: true,
				gross_amount: true,
				admin_fee: true,
				ppn_fee: true,
				ppn_percentage: true,
			},
		});
	}
}

export default new SubscriptionService();
