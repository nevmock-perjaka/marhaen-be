import { successResponse } from "../../utils/response.js";
import ProductService from "./product-service.js";

class ProductController {
    async getAll(req, res) {
        const result = await ProductService.getAll();
        return successResponse(res, result);
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await ProductService.getById(id);
        return successResponse(res, result);
    }

    async create(req, res) {
        const result = await ProductService.create(req.body);
        return successResponse(res, result);
    }

    async update(req, res) {
        const { id } = req.params;
        const result = await ProductService.update(id, req.body);
        return successResponse(res, result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await ProductService.delete(id);
        return successResponse(res, result);
    }
}

export default new ProductController();
