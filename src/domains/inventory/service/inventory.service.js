import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class InventoryService {
    async findAll() {
        return await db.inventory.findMany({
            include: {
                Product_config: true,
                Add_on_config: true,
                Input_history: true,
            },
        });
    }

    async findById(id) {
        const inventory = await db.inventory.findUnique({
            where: { id },
            include: {
                Product_config: true,
                Add_on_config: true,
                Input_history: true,
            },
        });

        if (!inventory) {
            throw BaseError.notFound("Inventory tidak ditemukan.");
        }

        return inventory;
    }

    async create(data) {
        return await db.inventory.create({ data });
    }

    async update(id, data) {
        return await db.inventory.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return await db.inventory.delete({
            where: { id },
        });
    }
}

export default new InventoryService();
