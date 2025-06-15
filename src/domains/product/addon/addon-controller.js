import db from "../../../config/db.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import addonSchema from "./addon-schema.js";
import AddonService from "./addon-service.js";

class AddonController {
    async getAll(req, res) {
        const userId = req.user.id;
        const addons = await AddonService.findAll(userId);

        return successResponse(res, addons);
    }

    async getById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        const addon = await AddonService.findById(id, userId);

        return successResponse(res, addon);
    }

    async create(req, res) {
        const value = req.body;

        value.owned_by = req.user.id;
        value.created_by = req.profile.id;
        value.updated_by = req.profile.id;

        const created = await AddonService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        let value = req.body;

        value.updated_by = req.profile.id;
        value.owned_by = req.user.id;

        const updated = await AddonService.update(id, value);

        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        
        const deleted = await AddonService.delete(id, userId);

        return successResponse(res, deleted);
    }
}

export default new AddonController();