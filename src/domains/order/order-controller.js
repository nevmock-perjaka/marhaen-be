import OrderService from "./order-service.js";
import { successResponse, createdResponse } from "../../utils/response.js";

class OrderController {
  async getAll(req, res) {
    const userId = req.user.id;
    const query = req.query;
    const orders = await OrderService.findAll(userId, query);
    return successResponse(res, orders.data, orders.count, orders.meta);
  }

  async getById(req, res) {
    const { orderId } = req.params;
    const userId = req.user.id;
    const order = await OrderService.findById(orderId, userId);
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
}

export default new OrderController();
