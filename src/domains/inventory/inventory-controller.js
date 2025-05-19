import InventoryService from "./inventory-service.js";
import { successResponse, createdResponse } from "../../utils/response.js";
import BaseError from "../../base_classes/base-error.js";
import inventorySchema from "./inventory-schema.js";

class InventoryController {
    async getAll(req, res) {
        const inventories = await InventoryService.findAll();
        return successResponse(res, inventories);
    }

    async getById(req, res) {
        const { id } = req.params;
        const inventory = await InventoryService.findById(id);
        return successResponse(res, inventory);
    }

    async create(req, res) {
        const { error, value } = inventorySchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await InventoryService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = inventorySchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await InventoryService.update(id, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await InventoryService.delete(id);
        return successResponse(res, deleted);
    }
}

export default new InventoryController();
