import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class DiscountService {
    async findAll() {
        return await db.discount.findMany({
            include: {
                Product_discount: true,
                Order: true,
            },
        });
    }

    async findById(id) {
        const discount = await db.discount.findUnique({
            where: { id },
            include: {
                Product_discount: true,
                Order: true,
            },
        });

        if (!discount) {
            throw BaseError.notFound("Diskon tidak ditemukan.");
        }

        return discount;
    }

    async create(data) {
        return await db.discount.create({ data });
    }

    async update(id, data) {
        return await db.discount.update({
            where: { id },
            data,
        });
    }

    async softDelete(id) {
        return await db.discount.update({
            where: { id },
            data: { is_active: false },
        });
    }
}

export default new DiscountService();
