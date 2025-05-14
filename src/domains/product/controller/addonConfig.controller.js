import db from "../../../config/db.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import addonConfigSchema from "../schema/addonConfig.schema.js";

class AddonConfigController {
    async getAll(req, res) {
        const result = await db.add_on_config.findMany({
            include: {
                add_on: true,
                inventory: true,
            },
        });

        return successResponse(res, result);
    }

    async getById(req, res) {
        const { id } = req.params;

        const data = await db.add_on_config.findUnique({
            where: { id },
            include: {
                add_on: true,
                inventory: true,
            },
        });

        if (!data) throw BaseError.notFound("Add-on Config tidak ditemukan.");
        return successResponse(res, data);
    }

    async create(req, res) {
        const { error, value } = addonConfigSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await db.add_on_config.create({ data: value });
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = addonConfigSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await db.add_on_config.update({
            where: { id },
            data: value,
        });

        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;

        // opsional: pakai hard delete kalau tidak ada `is_active`
        const deleted = await db.add_on_config.delete({
            where: { id },
        });

        return successResponse(res, deleted);
    }
}

export default new AddonConfigController();
