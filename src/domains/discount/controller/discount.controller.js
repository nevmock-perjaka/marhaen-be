import DiscountService from "../service/discount.service.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import discountSchema from "../schema/discount.schema.js";

class DiscountController {
    async getAll(req, res) {
        const discounts = await DiscountService.findAll();
        return successResponse(res, discounts);
    }

    async getById(req, res) {
        const { id } = req.params;
        const discount = await DiscountService.findById(id);
        return successResponse(res, discount);
    }

    async create(req, res) {
        const { error, value } = discountSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await DiscountService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = discountSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await DiscountService.update(id, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await DiscountService.softDelete(id);
        return successResponse(res, deleted);
    }
}

export default new DiscountController();
