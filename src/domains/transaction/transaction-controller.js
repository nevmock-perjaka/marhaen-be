import { successResponse } from "../../utils/response.js";
import TransactionService from "./transaction-service.js";

class TransactionController {
    async getAll(req, res) {
        const result = await TransactionService.getAll();
        return successResponse(res, result);
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await TransactionService.getById(id);
        return successResponse(res, result);
    }

    async create(req, res) {
        const result = await TransactionService.create(req.body);
        return successResponse(res, result);
    }

    async update(req, res) {
        const { id } = req.params;
        const result = await TransactionService.update(id, req.body);
        return successResponse(res, result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await TransactionService.delete(id);
        return successResponse(res, result);
    }
}

export default new TransactionController();
