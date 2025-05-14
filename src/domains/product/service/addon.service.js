import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class AddonService {
    async findAll() {
        return await db.add_on.findMany({
            include: {
                add_on_group: true,
                Add_on_config: true
            }
        });
    }

    async findById(id) {
        const addon = await db.add_on.findUnique({
            where: { id },
            include: {
                add_on_group: true,
                Add_on_config: true
            }
        });

        if (!addon) throw BaseError.notFound("Add-on tidak ditemukan.");
        return addon;
    }

    async create(data) {
        return await db.add_on.create({ data });
    }

    async update(id, data) {
        return await db.add_on.update({
            where: { id },
            data
        });
    }

    async softDelete(id) {
        return await db.add_on.update({
            where: { id },
            data: { is_active: false }
        });
    }
}

export default new AddonService();