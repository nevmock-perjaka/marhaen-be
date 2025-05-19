import ProductDiscountService from "./productDiscount-service.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import productDiscountSchema from "./productDiscount-schema.js";

class ProductDiscountController {
    async getAll(req, res) {
        const result = await ProductDiscountService.findAll();
        return successResponse(res, result);
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await ProductDiscountService.findById(id);
        return successResponse(res, result);
    }

    async create(req, res) {
        const { error, value } = productDiscountSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await ProductDiscountService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = productDiscountSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await ProductDiscountService.update(id, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await ProductDiscountService.delete(id);
        return successResponse(res, deleted);
    }
}

export default new ProductDiscountController();