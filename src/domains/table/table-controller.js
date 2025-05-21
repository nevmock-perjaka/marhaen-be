import TableService from "./table-service.js";
import { successResponse, createdResponse } from "../../utils/response.js";
import BaseError from "../../base_classes/base-error.js";
import tableSchema from "./table-schema.js";

class TableController {
    async getAll(req, res) {
        const tables = await TableService.findAll();
        return successResponse(res, tables);
    }

    async getById(req, res) {
        const { tableId } = req.params;
        const table = await TableService.findById(tableId);
        return successResponse(res, table);
    }

    async create(req, res) {
        const { error, value } = tableSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await TableService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { tableId } = req.params;
        const { error, value } = tableSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await TableService.update(tableId, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { tableId } = req.params;
        const deleted = await TableService.softDelete(tableId);
        return successResponse(res, deleted);
    }
}

export default new TableController();
