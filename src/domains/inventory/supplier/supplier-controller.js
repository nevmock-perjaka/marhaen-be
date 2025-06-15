import SupplierService from "./supplier-service.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import supplierSchema from "./supplier-schema.js";

class SupplierController {
    async getAll(req, res) {
        const userId = req.user.id;
        const suppliers = await SupplierService.findAll(userId);
        return successResponse(res, suppliers);
    }

    async getById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const supplier = await SupplierService.findById(id, userId);
        return successResponse(res, supplier);
    }

    async create(req, res) {
        let value = req.body;

        value.owned_by = req.user.id;
        value.created_by = req.profile.id;
        value.updated_by = req.profile.id;
    
        const created = await SupplierService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        let value = req.body;

        value.updated_by = req.profile.id;
        value.owned_by = req.user.id;

        const updated = await SupplierService.update(id, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await SupplierService.delete(id, userId);
        return successResponse(res, deleted);
    }
}

export default new SupplierController();
