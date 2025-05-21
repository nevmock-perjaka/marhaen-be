import OrderService from "./order-service.js";
import { successResponse, createdResponse } from "../../utils/response.js";
import BaseError from "../../base_classes/base-error.js";
import orderSchema from "./order-schema.js";

class OrderController {
    async getAll(req, res) {
        const orders = await OrderService.findAll();
        return successResponse(res, orders);
    }

    async getById(req, res) {
        const { orderId } = req.params;
        const order = await OrderService.findById(orderId);
        return successResponse(res, order);
    }

    async create(req, res) {
        const { error, value } = orderSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await OrderService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { orderId } = req.params;
        const { error, value } = orderSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await OrderService.update(orderId, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { orderId } = req.params;
        const deleted = await OrderService.delete(orderId);
        return successResponse(res, deleted);
    }
}

export default new OrderController();
