import db from "../../../config/db.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import configSchema from "./productConfig-schema.js";

class ProductConfigController {
    async getAll(req, res) {
        const configs = await db.product_config.findMany({
            include: {
                product: true,
                inventory: true
            }
        });

        return successResponse(res, configs);
    }

    async getById(req, res) {
        const { id } = req.params;

        const config = await db.product_config.findUnique({
            where: { id },
            include: {
                product: true,
                inventory: true
            }
        });

        if (!config) throw BaseError.notFound("Konfigurasi produk tidak ditemukan.");
        return successResponse(res, config);
    }

    async create(req, res) {
        const { error, value } = configSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await db.product_config.create({ data: value });
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = configSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await db.product_config.update({
            where: { id },
            data: value
        });

        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        await db.product_config.delete({ where: { id } });

        return successResponse(res, { message: "Konfigurasi berhasil dihapus." });
    }
}

export default new ProductConfigController();