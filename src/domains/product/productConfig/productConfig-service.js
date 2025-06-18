import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class ProductConfigService {
    async findAll(userId) {
        return await db.product_config.findMany({
            where: {
                owned_by: userId
            },
            include: {
                product: true,
                inventory: true
            }
        });
    }

    async findById(id, userId) {
        const config = await db.product_config.findUnique({
            where: { id },
            include: {
                product: true,
                inventory: true
            }
        });

        if (!config) throw BaseError.notFound("Product configuration not found.");
        if (config.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this configuration.");

        return config;
    }

    async create(data) {
        const configExists = await db.product_config.findFirst({
            where: {
                product_id: data.product_id,
                inventory_id: data.inventory_id,
                owned_by: data.owned_by
            }
        });
        
        if (configExists) {
            throw BaseError.badRequest("Product configuration already exists for this product and inventory.");
        }

        return await db.product_config.create({ data });
    }

    async update(id, data) {
        await this.checkPermission(id, data.owned_by);

        return await db.product_config.update({
            where: { id },
            data
        });
    }

    async delete(id, userId) {
        await this.checkPermission(id, userId);

        return await db.product_config.delete({ where: { id } });
    }

    async checkPermission(id, userId) {
        const config = await db.product_config.findUnique({ where: { id } });
        if (!config) throw BaseError.notFound("Product configuration not found.");
        if (config.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this configuration.");
    }
}

export default new ProductConfigService();
