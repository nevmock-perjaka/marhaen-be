import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";

class InventoryService {
    async findAll(userId) {
        return await db.inventory.findMany({
            where: {
                owned_by: userId,
            },
            include: {
                Product_config: true,
                Add_on_config: true,
                Input_history: true,
            },
        });
    }

    async findById(id, userId) {
        const inventory = await db.inventory.findUnique({
            where: { id },
            include: {
                Product_config: true,
                Add_on_config: true,
                Input_history: true,
            },
        });

        if (!inventory) {
            throw BaseError.notFound("Inventory not found.");
        }

        if (inventory.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this inventory.");
        }

        return inventory;
    }

    async create(data) {
        return await db.inventory.create({ data });
    }

    async update(id, data) {
        await this.checkPermission(id, data.owned_by)

        return await db.inventory.update({
            where: { id },
            data,
        });
    }

    async delete(id, userId) {
        await this.checkPermission(id, userId)

        return await db.inventory.delete({
            where: { id },
        });
    }

    async checkPermission(id, userId) {
        const inventory = await db.inventory.findUnique({
            where: { id },
        });

        if (!inventory) {
            throw BaseError.notFound("Inventory not found.");
        }

        if (inventory.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this inventory.");
        }
    }
}

export default new InventoryService();
