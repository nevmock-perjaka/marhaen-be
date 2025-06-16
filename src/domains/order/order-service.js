import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";

class OrderService {
    async findAll() {
        return await db.order.findMany({
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
                        product: true
                    }
                },
                Order_item_add_on: {
                    include: {
                        product: true
                    }
                },
                Order_transaction: true
            }
        });

        if (!order) throw BaseError.notFound("Order tidak ditemukan.");
        return order;
    }

    async create(data) { 
        return db.$transaction(async (tx) => {
            const activeShift = await tx.staff_log.findFirst({
                where: {
                    owned_by: data.owned_by,
                    end_timestamp: null, // Hanya ambil yang belum clock out
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
            
            const discountExists = data.discount_id ? await tx.discount.findUnique({
                where: { id: data.discount_id }
            }) : null;
            
            if (data.discount_id && !discountExists) throw BaseError.notFound("Discount not found.");
            if (data.discount_id && discountExists.owned_by !== data.owned_by) throw BaseError.forbidden("You are not allowed to access this discount.");
            
            const products = data.order_items.map(item => item.product_id);
            const productExists = await tx.product.findMany({
                where: {
                    id: { in: products },
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

            if (productExists.length !== products.length) throw BaseError.badRequest("Some products do not exist or are not owned by the user.");

            // Check if the add-ons exist and are owned by the user
            const addOnIds = data.order_items.flatMap(item => item.order_item_add_ons || []);

            

            // Ambil semua add_on beserta info grupnya (untuk cek product_id)
            const addOns = await tx.add_on.findMany({
                where: {
                    id: { in: addOnIds },
                    owned_by: data.owned_by,
                },
                include: {
                    add_on_group: true, // supaya dapat product_id dari group-nya
                }
            });

            if (addOns.length !== addOnIds.length) throw BaseError.badRequest("Some add-ons do not exist or are not owned by the user.");

            // Mapping add_on_id → product_id yang seharusnya
            const addOnToProductMap = new Map(
                addOns.map(addOn => [addOn.id, addOn.add_on_group.product_id])
            );

            // Validasi: pastikan semua order_item_add_ons sesuai dengan product_id parent-nya
            for (const item of data.order_items) {
                for (const addOnId of item.order_item_add_ons || []) {
                    const expectedProductId = addOnToProductMap.get(addOnId);
                    if (!expectedProductId) {
                        throw new Error(`Add-on ${addOnId} tidak ditemukan atau tidak valid.`);
                    }
                    if (expectedProductId !== item.product_id) {
                        throw new Error(`Add-on ${addOnId} bukan bagian dari product ${item.product_id}.`);
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
                        create: item.order_item_add_ons.map(addOnId => {
                            let matchedAddOn = null;

                            for (const group of product.Add_on_group) {
                                matchedAddOn = group.Add_on.find(a => a.id === addOnId);
                                if (matchedAddOn) break;
                            }

                            if (!matchedAddOn) {
                                throw new Error(`Add-on ${addOnId} tidak ditemukan untuk product ${product.id}`);
                            }

                            return {
                                add_on_id: matchedAddOn.id,
                                price: matchedAddOn.price,
                                created_by: data.created_by,
                                updated_by: data.updated_by,
                                owned_by: data.owned_by
                            };
                        })
                    }
                }
            })

            const total_gross = orderItems.reduce((total, item) => {
                const itemTotal = item.price;
                const addOnTotal = item.Order_item_add_on.create.reduce((sum, addOn) => sum + addOn.price, 0);
                return total + ((itemTotal + addOnTotal) * item.quantity);
            }, 0);

            data = {
                order_by: data.order_by,
                status: "pending",
                total_gross: total_gross, // Total gross akan dihitung di level database
                phone_number: data.phone_number,
                table_id: data.table_id,
                discount_id: data.discount_id,
                staff_id: data.staff_id,
                owned_by: data.owned_by,
                created_by: data.created_by,
                updated_by: data.updated_by,
                Order_item: {
                    create: orderItems
                }
            }

            const order = await tx.order.create({
                data,
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

            const parameter = {
                transaction_details: {
                    order_id: order.id,
                    gross_amount: order.total_gross,
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    first_name: order.order_by,
                    phone: order.phone_number,
                },
                enabled_payments: [
                    'other_qris'
                ],
                item_details: order.Order_item.map(item => {
                    const addOnTotal = item.Order_item_add_on.reduce((sum, addOn) => sum + addOn.price, 0);
                    return {
                        id: item.product_id,
                        price: item.price + addOnTotal,
                        quantity: item.quantity,
                        name: `${item.product.name} with ${item.Order_item_add_on.map(addOn => addOn.add_on.name).join(", ")}`,
                    };
                }),   
                metadata: {
                    "type": "order",
                    "id": order.id,
                }
            }

            const snap = midtransSnap.createTransaction(parameter);

            if (!snap) throw Error("Failed to create Midtrans transaction");

            
        })
        
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