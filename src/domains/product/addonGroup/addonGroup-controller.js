import db from "../../../config/db.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import addonGroupSchema from "./addonGroup-schema.js";

class AddonGroupController {
    async getAll(req, res) {
        const groups = await db.add_on_group.findMany({
            where: { is_active: true },
            include: {
                Add_on: true,
                product: true
            }
        });

        return successResponse(res, groups);
    }

    async getById(req, res) {
        const { id } = req.params;

        const group = await db.add_on_group.findUnique({
            where: { id },
            include: {
                Add_on: true,
                product: true
            }
        });

        if (!group) throw BaseError.notFound("Grup add-on tidak ditemukan.");
        return successResponse(res, group);
    }

    async create(req, res) {
        const { error, value } = addonGroupSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await db.add_on_group.create({ data: value });
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = addonGroupSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await db.add_on_group.update({
            where: { id },
            data: value
        });

        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;

        const deleted = await db.add_on_group.update({
            where: { id },
            data: { is_active: false }
        });

        return successResponse(res, deleted);
    }
}

export default new AddonGroupController();