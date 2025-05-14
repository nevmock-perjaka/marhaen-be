import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class AddonConfigService {
    async findAll() {
        return await db.add_on_config.findMany({
            include: {
                add_on: true,
                inventory: true,
            },
        });
    }

    async findById(id) {
        const addonConfig = await db.add_on_config.findUnique({
            where: { id },
            include: {
                add_on: true,
                inventory: true,
            },
        });

        if (!addonConfig) {
            throw BaseError.notFound("Add-on Config tidak ditemukan.");
        }

        return addonConfig;
    }

    async create(data) {
        return await db.add_on_config.create({ data });
    }

    async update(id, data) {
        return await db.add_on_config.update({
            where: { id },
            data,
        });
    }

    async softDelete(id) {
        return await db.add_on_config.update({
            where: { id },
            data: { is_active: false }, // hanya jika kamu pakai field is_active di model
        });
    }
}

export default new AddonConfigService();
