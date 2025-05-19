import OrderItemAddonService from "./orderItemAddon-service.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import orderItemAddonSchema from "./orderItemAddon-schema.js";

class OrderItemAddonController {
    async getAll(req, res) {
        const addons = await OrderItemAddonService.findAll();
        return successResponse(res, addons);
    }

    async getById(req, res) {
        const { orderItemAddonId } = req.params;
        const addon = await OrderItemAddonService.findById(orderItemAddonId);
        return successResponse(res, addon);
    }

    async create(req, res) {
        const { error, value } = orderItemAddonSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await OrderItemAddonService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { orderItemAddonId } = req.params;
        const { error, value } = orderItemAddonSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await OrderItemAddonService.update(orderItemAddonId, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { orderItemAddonId } = req.params;
        const deleted = await OrderItemAddonService.delete(orderItemAddonId);
        return successResponse(res, deleted);
    }
}

export default new OrderItemAddonController();
