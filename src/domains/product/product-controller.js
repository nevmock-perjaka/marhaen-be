import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";
import { successResponse, createdResponse } from "../../utils/response.js";
import productSchema from "./product-schema.js";

class ProductController {
    async getAll(req, res) {
        const products = await db.product.findMany({
            where: { is_active: true },
            include: {
                Add_on_group: true,
                Product_config: true
            }
        });

        return successResponse(res, products);
    }

    async getById(req, res) {
        const { id } = req.params;
        const product = await db.product.findUnique({
            where: { id },
            include: {
                Add_on_group: true,
                Product_config: true
            }
        });

        if (!product) throw BaseError.notFound("Produk tidak ditemukan.");
        return successResponse(res, product);
    }

    async create(req, res) {
        const { error, value } = productSchema.create.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const created = await db.product.create({ data: value });
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        const { error, value } = productSchema.update.validate(req.body);
        if (error) throw BaseError.badRequest(error.details[0].message);

        const updated = await db.product.update({
            where: { id },
            data: value
        });

        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await db.product.update({
            where: { id },
            data: { is_active: false }
        });

        return successResponse(res, deleted);
    }
}

export default new ProductController();
