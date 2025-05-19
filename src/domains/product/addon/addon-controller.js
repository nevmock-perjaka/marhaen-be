import db from "../../../config/db.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import addonSchema from "./addon-schema.js";

class AddonController {
    async getAll(req, res) {
        const addons = await db.add_on.findMany({
            where: { is_active: true },
            include: {
                add_on_group: true,
                Add_on_config: true
            }
        });

        return successResponse(res, addons);
    }

    async getById(req, res) {
        const { id } = req.params;

        const addon = await db.add_on.findUnique({
            where: { id },
            include: {
                add_on_group: true,
                Add_on_config: true
            }
        });

        if (!addon) throw BaseError.notFound("Add-on tidak ditemukan.");
        return successResponse(res, addon);
    }

    async create(req, res) {
        const { error, value } = addonSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await db.add_on.create({ data: value });
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = addonSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await db.add_on.update({
            where: { id },
            data: value
        });

        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;

        const deleted = await db.add_on.update({
            where: { id },
            data: { is_active: false }
        });

        return successResponse(res, deleted);
    }
}

export default new AddonController();