import TableService from "./table-service.js";
import { successResponse, createdResponse } from "../../utils/response.js";
import BaseError from "../../base_classes/base-error.js";

class TableController {
  async getAll(req, res) {
    const userId = req.user.id;
    const query = req.query;
    const tables = await TableService.findAll(userId, query);
    return successResponse(res, tables.data, tables.count, tables.meta);
  }

  async getById(req, res) {
    const { tableId } = req.params;
    const userId = req.user.id;
    const table = await TableService.findById(tableId, userId);
    return successResponse(res, table);
  }

  async create(req, res) {
    const value = req.body;

    value.owned_by = req.user.id;
    value.created_by = req.profile.id;
    value.updated_by = req.profile.id;

    const created = await TableService.create(value);
    return createdResponse(res, created);
  }

  async update(req, res) {
    const { tableId } = req.params;
    let value = req.body;

    value.updated_by = req.profile.id;
    value.owned_by = req.user.id;

    const updated = await TableService.update(tableId, value);
    return successResponse(res, updated);
  }

  async delete(req, res) {
    const { tableId } = req.params;
    const userId = req.user.id;
    const deleted = await TableService.delete(tableId, userId);
    return successResponse(res, deleted);
  }

  async uploadImage(req, res) {
    if (!req.file) {
      throw new BaseError("No file uploaded", 400);
    }

    const relativePath = `/public/table/${req.file.filename}`;

    return successResponse(res, relativePath);
  }
}

export default new TableController();
