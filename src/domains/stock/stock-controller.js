import { successResponse } from "../../utils/response.js";
import StockService from "./stock-service.js";

class StockController {
    async getAll(req, res) {
        const result = await StockService.getAll();
        return successResponse(res, result);
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await StockService.getById(id);
        return successResponse(res, result);
    }

    async create(req, res) {
        const data = req.body;
        const result = await StockService.create(data);
        return successResponse(res, result);
    }

    async update(req, res) {
        const { id } = req.params;
        const result = await StockService.update(id, req.body);
        return successResponse(res, result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await StockService.delete(id);
        return successResponse(res, result);
    }
}

export default new StockController();
