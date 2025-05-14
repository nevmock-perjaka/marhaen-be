import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class OrderItemService {
    async findAll() {
        return await db.order_item.findMany({
            include: {
                product: true,
                order: true
            }
        });
    }

    async findById(orderItemId) {
        const item = await db.order_item.findUnique({
            where: { id: orderItemId },
            include: {
                product: true,
                order: true
            }
        });

        if (!item) throw BaseError.notFound("Order item tidak ditemukan.");
        return item;
    }

    async create(data) {
        return await db.order_item.create({ data });
    }

    async update(orderItemId, data) {
        return await db.order_item.update({
            where: { id: orderItemId },
            data
        });
    }

    async delete(orderItemId) {
        return await db.order_item.delete({
            where: { id: orderItemId }
        });
    }
}

export default new OrderItemService();
