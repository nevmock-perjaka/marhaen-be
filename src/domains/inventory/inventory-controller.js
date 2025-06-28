import InventoryService from "./inventory-service.js";
import { successResponse, createdResponse } from "../../utils/response.js";

class InventoryController {
  async getAll(req, res) {
    const userId = req.user.id;
    const query = req.query;
    const inventories = await InventoryService.findAll(userId, query);
    return successResponse(res, inventories.data, inventories.count, inventories.meta);
  }

  async getById(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const inventory = await InventoryService.findById(id, userId);
    return successResponse(res, inventory);
  }

  async create(req, res) {
    const value = req.body;

    value.owned_by = req.user.id;
    value.created_by = req.profile.id;
    value.updated_by = req.profile.id;

    const created = await InventoryService.create(value);
    return createdResponse(res, created);
  }

  async update(req, res) {
    const { id } = req.params;
    let value = req.body;

    value.updated_by = req.profile.id;
    value.owned_by = req.user.id;

    const updated = await InventoryService.update(id, value);
    return successResponse(res, updated);
  }

  async delete(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = await InventoryService.delete(id, userId);
    return successResponse(res, deleted);
  }
}

export default new InventoryController();
