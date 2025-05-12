import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";
import joi from "joi";
import { createCategorySchema, updateCategorySchema } from "./category-schema.js";

class CategoryService {
    async getAll() {
        return await db.category.findMany();
    }

    async getById(id) {
        const category = await db.category.findUnique({ where: { id } });
        if (!category) throw BaseError.notFound("Category not found");
        return category;
    }

    async create(data) {
        const { error } = createCategorySchema.validate(data);
        if (error) throw new joi.ValidationError("Invalid data", error.details);

        const created = await db.category.create({ data });
        if (!created) throw BaseError.badRequest("Failed to create category");

        return { message: "Category created successfully", data: created };
    }

    async update(id, data) {
        const existing = await db.category.findUnique({ where: { id } });
        if (!existing) throw BaseError.notFound("Category not found");

        const { error } = updateCategorySchema.validate(data);
        if (error) throw new joi.ValidationError("Invalid data", error.details);

        const updated = await db.category.update({ where: { id }, data });
        return { message: "Category updated successfully", data: updated };
    }

    async delete(id) {
        const existing = await db.category.findUnique({ where: { id } });
        if (!existing) throw BaseError.notFound("Category not found");

        const deleted = await db.category.delete({ where: { id } });
        return { message: "Category deleted successfully", data: deleted };
    }
}

export default new CategoryService();
