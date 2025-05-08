import { successResponse } from "../../utils/response.js";
import CategoryService from "./category-service.js";

class CategoryController {
    async getAll(req, res) {
        const result = await CategoryService.getAll();
        return successResponse(res, result);
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await CategoryService.getById(id);
        return successResponse(res, result);
    }

    async create(req, res) {
        const result = await CategoryService.create(req.body);
        return successResponse(res, result);
    }

    async update(req, res) {
        const { id } = req.params;
        const result = await CategoryService.update(id, req.body);
        return successResponse(res, result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await CategoryService.delete(id);
        return successResponse(res, result);
    }
}

export default new CategoryController();
