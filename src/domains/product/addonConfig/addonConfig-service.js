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

    async findById(id, userId) {
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

        if (addonConfig.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this add-on config.");
        }

        return addonConfig;
    }

    async create(data) {
        const inventoryIds = data.config.map(item => item.inventory_id);

        const inventoryExists = await db.inventory.findMany({
            where: {
                id: { in: inventoryIds },
                owned_by: data.owned_by,
            }
        })

        if (inventoryExists.length !== inventoryIds.length) throw BaseError.notFound("Duplicate inventory IDs or some do not belong to the user.");

        const existingConfigs = await db.add_on_config.findMany({
            where: {
                add_on_id: data.add_on_id,
                inventory_id: { in: inventoryIds },
                owned_by: data.owned_by,
            }
        });

        if (existingConfigs.length > 0) {
            const existingIds = existingConfigs.map(c => c.inventory_id);
            throw BaseError.badRequest(`Configuration already exists for config(s): ${existingIds.join(', ')}`);
        }

        const datas = data.config.map((item) => ({
            add_on_id: data.add_on_id,
            inventory_id: item.inventory_id,
            operation: item.operation,
            value: item.value,
            owned_by: data.owned_by,
            created_by: data.created_by,
            updated_by: data.updated_by,
        }));

        return await db.add_on_config.createManyAndReturn({ data: datas });
    }   

    async update(data) {
        return await db.$transaction(async (tx) => {
            const inventoryIds = data.config.map(item => item.inventory_id);
        
            const inventoryExists = await tx.inventory.findMany({
                where: {
                    id: { in: inventoryIds },
                    owned_by: data.owned_by,
                }
            })

            if (inventoryExists.length !== inventoryIds.length) throw BaseError.notFound("Duplicate inventory IDs or some do not belong to the user.");

            await tx.add_on_config.deleteMany({
                where: {
                    add_on_id: data.add_on_id,
                    owned_by: data.owned_by,
                }
            });

            const existingConfigs = await tx.add_on_config.findMany({
                where: {
                    add_on_id: data.add_on_id,
                    inventory_id: { in: inventoryIds },
                    owned_by: data.owned_by,
                }
            });

            if (existingConfigs.length > 0) {
                const existingIds = existingConfigs.map(c => c.inventory_id);
                throw BaseError.badRequest(`Configuration already exists for config(s): ${existingIds.join(', ')}`);
            }

            const datas = data.config.map((item) => ({
                add_on_id: data.add_on_id,
                inventory_id: item.inventory_id,
                operation: item.operation,
                value: item.value,
                owned_by: data.owned_by,
                created_by: data.created_by,
                updated_by: data.updated_by,
            }));

            return await tx.add_on_config.createManyAndReturn({ data: datas });
        })
    }

    async delete(id, userId) {
        await this.checkPermission(id, userId);
        
        return await db.add_on_config.delete({
            where: { id },
        });
    }

    async checkPermission(id, userId) {
        const addonConfig = await db.add_on_config.findUnique({
            where: { id },
        });

        if (!addonConfig) {
            throw BaseError.notFound("Add-on Config tidak ditemukan.");
        }

        if (addonConfig.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this add-on config.");
        }

        return addonConfig;
    }
}

export default new AddonConfigService();
