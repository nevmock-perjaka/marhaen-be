import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";
import joi from "joi";

class StockService {
    async getAll() {
        return await db.userProduct.findMany({
            include: {
                product: true
            }
        });
    }

    async getById(id) {
        const userProduct = await db.userProduct.findUnique({
            where: { id },
            include: {
                product: true
            }
        });

        if (!userProduct) {
            throw BaseError.notFound("Stock not found");
        }

        return userProduct;
    }

    async create(data) {
        const product = await db.product.findUnique({
            where: { id: data.product_id }
        });

        if (!product) {
            const stack = [{
                message: "Product not found.",
                path: ["product_id"]
            }];
            throw new joi.ValidationError("Invalid product ID", stack);
        }

        const created = await db.userProduct.create({ data });

        if (!created) {
            throw BaseError.badRequest("Failed to create stock");
        }

        return {
            message: "Stock created successfully",
            data: created
        };
    }

    async update(id, data) {
        const userProduct = await db.userProduct.findUnique({
            where: { id }
        });

        if (!userProduct) {
            throw BaseError.notFound("Stock not found");
        }

        const updated = await db.userProduct.update({
            where: { id },
            data
        });

        if (!updated) {
            throw BaseError.badRequest("Failed to update stock");
        }

        return {
            message: "Stock updated successfully",
            data: updated
        };
    }

    async delete(id) {
        const userProduct = await db.userProduct.findUnique({
            where: { id }
        });

        if (!userProduct) {
            throw BaseError.notFound("Stock not found");
        }

        const deleted = await db.stock.delete({
            where: { id }
        });

        if (!deleted) {
            throw BaseError.badRequest("Failed to delete stock");
        }

        return {
            message: "Stock deleted successfully",
            data: deleted
        };
    }
}

export default new StockService();