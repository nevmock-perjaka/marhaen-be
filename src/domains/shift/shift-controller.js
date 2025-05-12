import { successResponse } from "../../utils/response.js";
import ShiftService from "./shift-service.js";

class ShiftController {
    async getAll(req, res) {
        const result = await ShiftService.getAll();
        return successResponse(res, result);
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await ShiftService.getById(id);
        return successResponse(res, result);
    }

    async create(req, res) {
        const result = await ShiftService.create(req.body);
        return successResponse(res, result);
    }

    async update(req, res) {
        const { id } = req.params;
        const result = await ShiftService.update(id, req.body);
        return successResponse(res, result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await ShiftService.delete(id);
        return successResponse(res, result);
    }
}

export default new ShiftController();
