import InputHistoryService from "./inputHistory-service.js";
import { successResponse, createdResponse } from "../../../utils/response.js";
import BaseError from "../../../base_classes/base-error.js";
import inputHistorySchema from "./inputHistory-schema.js";

class InputHistoryController {
    async getAll(req, res) {
        const histories = await InputHistoryService.findAll();
        return successResponse(res, histories);
    }

    async getById(req, res) {
        const { id } = req.params;
        const history = await InputHistoryService.findById(id);
        return successResponse(res, history);
    }

    async create(req, res) {
        const { error, value } = inputHistorySchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await InputHistoryService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = inputHistorySchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await InputHistoryService.update(id, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await InputHistoryService.delete(id);
        return successResponse(res, deleted);
    }
}

export default new InputHistoryController();
