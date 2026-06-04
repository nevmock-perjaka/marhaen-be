import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";

class OrderService {
    async findAll(userId) {
        return await db.order.findMany({
            where: {
                owned_by: userId
            },
            include: {
                table: true,
                discount: true,
                Order_item: {
                    include: {
                        product: true,
                        Order_item_add_on: {
                            include: {
                                add_on: true
                            }
                        }
                    }
                },
                Order_transaction: true
            }
        });
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
                                add_on: true
                            }
                        }
                    }
                },
                Order_transaction: true
            }
        });

        if (!order) throw BaseError.notFound("Order not found.");
          
        return order;
    }

    async create(data) {
        const siteConfig = await db.site_config.findFirst();

        return await db.$transaction(async (tx) => {
            const activeShift = await tx.staff_log.findFirst({
                where: {
                    owned_by: data.owned_by,
                    end_timestamp: null,
                },
                orderBy: { start_timestamp: "desc" }
            });

            if (!activeShift) throw BaseError.badRequest("You must clock in first before creating an order.");

            data.staff_id = activeShift.staff_id;

            const tableExists = data.table_id ? await tx.table.findUnique({
                where: { id: data.table_id }
            }) : null;
            
            if (data.table_id && !tableExists) throw BaseError.notFound("Table not found.");
            if (data.table_id && tableExists.owned_by !== data.owned_by) throw BaseError.forbidden("You are not allowed to access this table.");
            if (data.table_id && !tableExists.is_active) throw BaseError.badRequest("Table is not active. Please activate the table first.");
            
            const discountExists = data.discount_id ? await tx.discount.findUnique({
                where: { id: data.discount_id }
            }) : null;

            const timeNow = new Date();
            
            if (data.discount_id && !discountExists) throw BaseError.notFound("Discount not found.");
            if (data.discount_id && discountExists.owned_by !== data.owned_by) throw BaseError.forbidden("You are not allowed to access this discount.");
            if (data.discount_id && !discountExists.is_active) throw BaseError.badRequest("Discount is not active. Please activate the discount first.");
            if (data.discount_id && timeNow < new Date(discountExists.start_at)) throw BaseError.badRequest("Discount is not yet active.");
            if (data.discount_id && timeNow > new Date(discountExists.expired_at)) throw BaseError.badRequest("Discount has expired.");
            if (data.discount_id && discountExists.used >= discountExists.max_use) throw BaseError.badRequest("Discount has reached its maximum usage limit.");
            
            const productIds = [...new Set(data.order_items.map(item => item.product_id))];

            const productExists = await tx.product.findMany({
                where: {
                    id: { in: productIds },
                    owned_by: data.owned_by
                },
                include: {
                    Add_on_group: {
                        include: {
                            Add_on: true
                        }
                    }
                }
            });

            if (productExists.length !== productIds.length) throw BaseError.badRequest("Some products do not exist or are not owned by the user.");

            const addOnIds = [...new Set(
                data.order_items.flatMap(item => item.order_item_add_ons || [])
            )];

            const addOns = await tx.add_on.findMany({
                where: {
                    id: { in: addOnIds },
                    owned_by: data.owned_by,
                },
                include: {
                    add_on_group: true,
                }
            });

            if (addOns.length !== addOnIds.length) throw BaseError.badRequest("Some add-ons do not exist or are not owned by the user.");

            const addOnToProductMap = new Map(
                addOns.map(addOn => [addOn.id, addOn.add_on_group.product_id])
            );

            for (const item of data.order_items) {
                const product = productExists.find(p => p.id === item.product_id);
                const selectedAddOns = item.order_item_add_ons || [];

                const addOnGroups = product.Add_on_group;

                for (const group of addOnGroups) {
                    const addOnsInGroup = group.Add_on.map(a => a.id);
                    const selectedInGroup = selectedAddOns.filter(id => addOnsInGroup.includes(id));

                    if (selectedInGroup.length > group.max_selection) {
                        throw BaseError.badRequest(
                            `Too many add-ons selected for group '${group.name}' in product '${product.name}'. Max allowed: ${group.max_selection}.`
                        );
                    }

                    if (group.is_required && selectedInGroup.length === 0) {
                        throw BaseError.badRequest(
                            `Add-on group '${group.name}' is required for product '${product.name}' but none were selected.`
                        );
                    }
                }
            }

            for (const item of data.order_items) {
                for (const addOnId of item.order_item_add_ons || []) {
                    const expectedProductId = addOnToProductMap.get(addOnId);
                    if (!expectedProductId) {
                        throw BaseError.badRequest(`Add-on ${addOnId} not found or not owned by the user.`);
                    }
                    if (expectedProductId !== item.product_id) {
                        throw BaseError.badRequest(`Add-on ${addOnId} does not belong to product ${item.product_id}.`);
                    }
                }
            }

            const orderItems = data.order_items.map(item => {
                const product = productExists.find(p => p.id === item.product_id);
                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: product.price,
                    note: item.note,
                    created_by: data.created_by,
                    updated_by: data.updated_by,
                    owned_by: data.owned_by,
                    Order_item_add_on: {
                        create: item.order_item_add_ons ? item.order_item_add_ons.map(addOnId => {
                            let matchedAddOn = null;

                            for (const group of product.Add_on_group) {
                                matchedAddOn = group.Add_on.find(a => a.id === addOnId);
                                if (matchedAddOn) break;
                            }

                            if (!matchedAddOn) {
                                throw BaseError.badRequest(`Add-on ${addOnId} tidak ditemukan untuk product ${product.id}`);
                            }

                            return {
                                add_on_id: matchedAddOn.id,
                                price: matchedAddOn.price,
                                created_by: data.created_by,
                                updated_by: data.updated_by,
                                owned_by: data.owned_by
                            };
                        }) : []
                    }
                }
            });

            let total_gross = orderItems.reduce((total, item) => {
                const itemTotal = item.price;
                const addOnTotal = item.Order_item_add_on.create.reduce((sum, addOn) => sum + addOn.price, 0);
                return total + ((itemTotal + addOnTotal) * item.quantity);
            }, 0);

            let discount = 0;
            
            if (discountExists) {
                if (total_gross < discountExists.min_order_amount) throw BaseError.badRequest(`Total order must be at least ${discountExists.min_order_amount} to apply this discount.`);

                if (discountExists.is_percentage) {
                    discount = (total_gross * (discountExists.value / 100));
                    if (discount > discountExists.max_discount) {
                        discount = discountExists.max_discount;
                    }
                } else {
                    discount = discountExists.value;
                }

                total_gross -= discount;
            }

            const orderData = {
                order_by: data.order_by,
                status: "Pending Payment",
                total_gross: total_gross,
                phone_number: data.phone_number,
                table_id: data.table_id,
                discount_id: data.discount_id,
                staff_id: data.staff_id,
                owned_by: data.owned_by,
                created_by: data.created_by,
                updated_by: data.updated_by,
                Order_item: {
                    create: orderItems
                },
                Order_transaction: {
                    create: {
                        is_production: false,
                        payment_method: 'manual_qris',
                        status: 'pending',
                        gross_amount: total_gross,
                        admin_fee: total_gross * 0.007,
                        ppn_fee: total_gross * (siteConfig.ppn_percentage / 100),
                        ppn_percentage: siteConfig.ppn_percentage,
                        owned_by: data.owned_by,
                        created_by: data.created_by,
                        updated_by: data.updated_by
                    }
                }
            };

            const order = await tx.order.create({
                data: orderData,
                include: {
                    table: true,
                    discount: true,
                    Order_item: {
                        include: {
                            product: true,
                            Order_item_add_on: {
                                include: {
                                    add_on: true
                                }
                            }
                        }
                    },
                    Order_transaction: true
                }
            });

            if (data.discount_id && discountExists) {
                await tx.discount.update({
                    where: {
                        id: discountExists.id
                    }, 
                    data: {
                        used: {
                            increment: 1
                        },
                        updated_by: data.updated_by
                    }
                });
            }

            return {
                id: order.id,
                order_transaction_id: order.Order_transaction[0].id,
                order_by: order.order_by,
                phone_number: order.phone_number,
                total_gross: order.total_gross,
                status: order.status,
                payment_method: 'manual_qris',
                created_at: order.created_at
            };
        }, { timeout: 20000 });
    }

    async confirmPayment(orderId, userId) {
        return await db.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    Order_item: {
                        include: {
                            product: true,
                            Order_item_add_on: true
                        }
                    },
                    Order_transaction: true,
                    discount: true
                }
            });

            if (!order) throw BaseError.notFound("Order not found.");
            if (order.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this order.");
            if (order.status === 'Paid') throw BaseError.badRequest("Order has already been paid.");
            if (order.status === 'Canceled') throw BaseError.badRequest("Cannot confirm a canceled order.");

            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: 'Paid',
                    updated_by: 'system'
                }
            });

            await tx.order_transaction.update({
                where: { id: order.Order_transaction[0].id },
                data: {
                    status: 'settlement',
                    updated_by: 'system'
                }
            });

            return {
                id: order.id,
                status: 'Paid',
                message: 'Order payment confirmed successfully'
            };
        }, { timeout: 20000 });
    }

    async cancelOrder(orderId, userId) {
        return await db.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    Order_transaction: true,
                    discount: true
                }
            });

            if (!order) throw BaseError.notFound("Order not found.");
            if (order.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this order.");
            if (order.status === 'Paid') throw BaseError.badRequest("Cannot cancel a paid order.");

            if (order.discount_id) {
                await tx.discount.update({
                    where: { id: order.discount_id },
                    data: {
                        used: { decrement: 1 },
                        updated_by: 'system'
                    }
                });
            }

            await tx.order.delete({
                where: { id: orderId }
            });

            return {
                id: orderId,
                message: 'Order cancelled successfully'
            };
        }, { timeout: 20000 });
    }

    async update(orderId, data) {
        return await db.order.update({
            where: { id: orderId },
            data
        });
    }

    async delete(orderId) {
        return await db.order.delete({
            where: { id: orderId }
        });
    }
}

export default new OrderService();
