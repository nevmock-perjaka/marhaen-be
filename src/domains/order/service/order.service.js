import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class OrderService {
    async findAll() {
        return await db.order.findMany({
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
        return await db.order.create({ data });
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