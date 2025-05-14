import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class ProductService {
    async findAll() {
        return await db.product.findMany({
            where: { is_active: true },
            include: {
                Add_on_group: true,
                Product_config: true
            }
        });
    }

    async findById(id) {
        const product = await db.product.findUnique({
            where: { id },
            include: {
                Add_on_group: true,
                Product_config: true
            }
        });

        if (!product) throw BaseError.notFound("Produk tidak ditemukan.");
        return product;
    }

    async create(data) {
        return await db.product.create({ data });
    }

    async update(id, data) {
        return await db.product.update({
            where: { id },
            data
        });
    }

    async softDelete(id) {
        return await db.product.update({
            where: { id },
            data: { is_active: false }
        });
    }
}

export default new ProductService();
