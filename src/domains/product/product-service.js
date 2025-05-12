import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";
import joi from "joi";

class ProductService {
    async getAll() {
        return await db.product.findMany({
            include: {
                category: true
            }
        });
    }

    async getById(id) {
        const product = await db.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        });

        if (!product) {
            throw BaseError.notFound("Product not found");
        }

        return product;
    }

    async create(data) {
        const category = await db.category.findUnique({
            where: { id: data.category_id }
        });

        if (!category) {
            const stack = [{
                message: "Category not found.",
                path: ["category_id"]
            }];
            throw new joi.ValidationError("Invalid category", stack);
        }

        const created = await db.product.create({ data });

        if (!created) {
            throw BaseError.badRequest("Failed to create product");
        }

        return {
            message: "Product created successfully",
            data: created
        };
    }

    async update(id, data) {
        const product = await db.product.findUnique({
            where: { id }
        });

        if (!product) {
            throw BaseError.notFound("Product not found");
        }

        const updated = await db.product.update({
            where: { id },
            data
        });

        if (!updated) {
            throw BaseError.badRequest("Failed to update product");
        }

        return {
            message: "Product updated successfully",
            data: updated
        };
    }

    async delete(id) {
        const product = await db.product.findUnique({
            where: { id }
        });

        if (!product) {
            throw BaseError.notFound("Product not found");
        }

        const deleted = await db.product.delete({
            where: { id }
        });

        if (!deleted) {
            throw BaseError.badRequest("Failed to delete product");
        }

        return {
            message: "Product deleted successfully",
            data: deleted
        };
    }
}

export default new ProductService();
