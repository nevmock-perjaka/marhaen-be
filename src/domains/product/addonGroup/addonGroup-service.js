import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class AddonGroupService {
    async findAll(userId) {
        return await db.add_on_group.findMany({
            where: {
                owned_by: userId,
            },
            include: {
                Add_on: true,
                product: true
            }
        });
    }

    async findById(id, userId) {
        const group = await db.add_on_group.findUnique({
            where: { id },
            include: {
                Add_on: true,
                product: true
            }
        });

        if (!group) throw BaseError.notFound("Add-on group not found.");
        if (group.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this add-on group.");
        
        return group;
    }

    async create(data) {
        return await db.add_on_group.create({ data });
    }

    async update(id, data) {
        await this.checkPermission(id, data.owned_by);

        return await db.add_on_group.update({
            where: { id },
            data
        });
    }

    async delete(id, userId) {
        await this.checkPermission(id, userId);

        return await db.add_on_group.delete({ where: { id } });
    }

    async checkPermission(id, userId) {
        const group = await db.add_on_group.findUnique({
            where: { id },
        });

        if (!group) throw BaseError.notFound("Add-on group not found.");
        if (group.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this add-on group.");
    }
}

export default new AddonGroupService();