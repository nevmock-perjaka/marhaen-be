import OrderItemService from "../service/orderItem.service.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import orderItemSchema from "../schema/orderItem.schema.js";

class OrderItemController {
    async getAll(req, res) {
        const items = await OrderItemService.findAll();
        return successResponse(res, items);
    }

    async getById(req, res) {
        const { orderItemId } = req.params;
        const item = await OrderItemService.findById(orderItemId);
        return successResponse(res, item);
    }

    async create(req, res) {
        const { error, value } = orderItemSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await OrderItemService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { orderItemId } = req.params;
        const { error, value } = orderItemSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await OrderItemService.update(orderItemId, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { orderItemId } = req.params;
        const deleted = await OrderItemService.delete(orderItemId);
        return successResponse(res, deleted);
    }
}

export default new OrderItemController();
