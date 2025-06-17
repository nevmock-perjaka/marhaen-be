import db from "../../../config/db.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import configSchema from "./productConfig-schema.js";
import productConfigService from "./productConfig-service.js";
import productService from "../product-service.js";
import Joi from "joi";
import inventoryService from "../../inventory/inventory-service.js";

class ProductConfigController {
    async getAll(req, res) {
        const userId = req.user.id;
        const configs = await productConfigService.findAll(userId);

        return successResponse(res, configs);
    }

    async getById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const config = await productConfigService.findById(id, userId);

        return successResponse(res, config);
    }

    async create(req, res) {
        let value = req.body;
        const userId = req.user.id;
        const profileId = req.profile.id;

        value.owned_by = userId;
        value.created_by = profileId;
        value.updated_by = profileId;

        try {
            await productService.findById(value.product_id, req.user.id);
        } catch (error) {
            let validation = "";
            let stack = [];

            validation += "Product not found.";

            stack.push({
                message: "Product not found.",
                path: ["product_id"]
            });

            throw new Joi.ValidationError(validation, stack);
        }

        try {
            await inventoryService.findById(value.product_id, req.user.id);
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

        const created = await productConfigService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        
        let value = req.body;
        value.updated_by = req.profile.id;
        value.owned_by = req.user.id;
        
        const updated = await productConfigService.update(id, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        await db.product_config.delete({ where: { id } });

        return successResponse(res, { message: "Konfigurasi berhasil dihapus." });
    }
}

export default new ProductConfigController();