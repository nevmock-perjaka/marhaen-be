import db from "../../../config/db.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import addonConfigSchema from "./addonConfig-schema.js";
import addonConfigService from "./addonConfig-service.js";
import addonService from "../addon/addon-service.js";
import path from "path";
import Joi from "joi";
import inventoryService from "../../inventory/inventory-service.js";

class AddonConfigController {
    async getAll(req, res) {
        const userId = req.user.id;
        const configs = await addonConfigService.findAll(userId);

        return successResponse(res, configs);
    }

    async getById(req, res) {
        const { id } = req.params;

        const userId = req.user.id;
        const data = await addonConfigService.findById(id, userId);

        if (!data) throw BaseError.notFound("Add-on Config tidak ditemukan.");
        return successResponse(res, data);
    }

    async create(req, res) {
        let value = req.body;
        const userId = req.user.id;
        const profileId = req.profile.id;

        value.owned_by = userId;
        value.created_by = profileId;
        value.updated_by = profileId;

        try {
            await addonService.findById(value.add_on_id, userId);
        } catch (error) {
            let validation = "";
            let stack = [];

            validation += "Add-on not found.";
            stack.push({
                message: "Add-on not found.",
                path: ["add_on_id"]
            });
            
            throw new Joi.ValidationError(validation, stack);
        }

        try {
            await inventoryService.findById(value.inventory_id, userId);
        } catch (error) {
            let validation = "";
            let stack = [];

            validation += "Inventory not found.";
            stack.push({
                message: "Inventory not found.",
                path: ["inventory_id"]
            });

            throw new Joi.ValidationError(validation, stack);
        }

        const data = await addonConfigService.create(value);
        return createdResponse(res, data);
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
