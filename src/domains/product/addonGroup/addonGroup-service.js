import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class AddonGroupService {
    async findAll() {
        return await db.add_on_group.findMany({
            include: {
                Add_on: true,
                product: true
            }
        });
    }

    async findById(id) {
        const group = await db.add_on_group.findUnique({
            where: { id },
            include: {
                Add_on: true,
                product: true
            }
        });

        if (!group) throw BaseError.notFound("Grup add-on tidak ditemukan.");
        return group;
    }

    async create(data) {
        return await db.add_on_group.create({ data });
    }

    async update(id, data) {
        return await db.add_on_group.update({
            where: { id },
            data
        });
    }

    async softDelete(id) {
        return await db.add_on_group.update({
            where: { id },
            data: { is_active: false }
        });
    }
}

export default new AddonGroupService();