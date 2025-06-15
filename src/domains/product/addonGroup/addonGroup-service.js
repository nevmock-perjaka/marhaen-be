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
        return await db.add_on_group.create({ 
            data,
            include: {
                Add_on: true,
                product: true
            }
        });
    }

    async update(id, data, updateAddOn, createAddOn) {
        await this.checkPermission(id, data.owned_by);

        let updatedGroup = await db.add_on_group.update({
            where: { id },
            data,
            include: {
                Add_on: true,
                product: true
            }
        });

        await Promise.all(updateAddOn.map(async (addon) => {
            await db.add_on.update({
                where: { 
                    id: addon.id,
                    add_on_group_id: updatedGroup.id
                },
                data: {
                    name: addon.name,
                    price: addon.price,
                    is_active: addon.is_active,
                    updated_by: data.updated_by,
                }
            });
        }));

        await db.add_on.createMany({
            data: createAddOn.map(addon => ({
                name: addon.name,
                price: addon.price,
                is_active: addon.is_active,
                owned_by: updatedGroup.owned_by,
                created_by: data.updated_by,
                updated_by: data.updated_by,
                add_on_group_id: updatedGroup.id,
            })),
        })

        updatedGroup = await db.add_on_group.findUnique({
            where: { id },
            include: {
                Add_on: true,
                product: true
            }
        });

        return updatedGroup;
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