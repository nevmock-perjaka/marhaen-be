import { createdResponse, successResponse } from "../../utils/response.js";
import OrderService from "./order-service.js";

class OrderController {
  async getAll(req, res) {
    const userId = req.user.id;
    const query = req.query;
    const orders = await OrderService.findAll(userId, query);
    return successResponse(res, orders.data, orders.count, orders.meta);
  }

  async getById(req, res) {
    const { orderId } = req.params;
    const order = await OrderService.findById(orderId);
    return successResponse(res, order);
  }

  async create(req, res) {
    const value = req.body;

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
