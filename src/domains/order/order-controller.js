import OrderService from "./order-service.js";
import { successResponse, createdResponse } from "../../utils/response.js";

class OrderController {
    async getAll(req, res) {
        const userId = req.user.id;
        const orders = await OrderService.findAll(userId);
        return successResponse(res, orders);
    }

    async getById(req, res) {
        const { orderId } = req.params;
        const order = await OrderService.findById(orderId);
        return successResponse(res, order);
    }

    async create(req, res) {
        const value = req.body;
        
        value.owned_by = req.user.id;
        value.created_by = req.profile.id;
        value.updated_by = req.profile.id;

        const created = await OrderService.create(value);
        return createdResponse(res, created);
    }

    async confirmPayment(req, res) {
        const { orderId } = req.params;
        const userId = req.user.id;

        const result = await OrderService.confirmPayment(orderId, userId);
        return successResponse(res, result);
    }

    async cancelOrder(req, res) {
        const { orderId } = req.params;
        const userId = req.user.id;

        const result = await OrderService.cancelOrder(orderId, userId);
        return successResponse(res, result);
    }
}

export default new OrderController();
