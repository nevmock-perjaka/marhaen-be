import SupplierService from "./supplier-service.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import supplierSchema from "./supplier-schema.js";

class SupplierController {
    async getAll(req, res) {
        const suppliers = await SupplierService.findAll();
        return successResponse(res, suppliers);
    }

    async getById(req, res) {
        const { id } = req.params;
        const supplier = await SupplierService.findById(id);
        return successResponse(res, supplier);
    }

    async create(req, res) {
        const { error, value } = supplierSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await SupplierService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = supplierSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await SupplierService.update(id, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await SupplierService.softDelete(id);
        return successResponse(res, deleted);
    }
}

export default new SupplierController();
