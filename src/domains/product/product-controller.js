import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";
import { successResponse, createdResponse } from "../../utils/response.js";
import ProductService from "./product-service.js";

class ProductController {
    async getAll(req, res) {
        const userId = req.user.id;
        const products = await ProductService.findAll(userId);

        return successResponse(res, products);
    }

    async getById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const product = await ProductService.findById(id, userId);

        return successResponse(res, product);
    }

    async create(req, res) {
        const value = req.body;

        value.owned_by = req.user.id;
        value.created_by = req.profile.id;
        value.updated_by = req.profile.id;

        const created = await ProductService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        let value = req.body;

        value.updated_by = req.profile.id;
        value.owned_by = req.user.id;

        const updated = await ProductService.update(id, value);

        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const deleted = await ProductService.delete(id, userId);

        return successResponse(res, deleted);
    }
}

export default new ProductController();
