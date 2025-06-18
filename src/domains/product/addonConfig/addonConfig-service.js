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
        return await db.add_on_config.create({ data });
    }

    async update(id, data) {
        await this.checkPermission(id, data.owned_by);

        return await db.add_on_config.update({
            where: { id },
            data,
        });
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
