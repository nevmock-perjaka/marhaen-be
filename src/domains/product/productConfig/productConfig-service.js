import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class ProductConfigService {
    async findAll() {
        return await db.product_config.findMany({
            include: {
                product: true,
                inventory: true
            }
        });
    }

    async findById(id) {
        const config = await db.product_config.findUnique({
            where: { id },
            include: {
                product: true,
                inventory: true
            }
        });

        if (!config) throw BaseError.notFound("Konfigurasi produk tidak ditemukan.");
        return config;
    }

    async create(data) {
        return await db.product_config.create({ data });
    }

    async update(id, data) {
        return await db.product_config.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return await db.product_config.delete({ where: { id } });
    }
}

export default new ProductConfigService();
