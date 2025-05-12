import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";
import joi from "joi";

class ShiftService {
    async getAll() {
        return await db.shift.findMany();
    }

    async getById(id) {
        const shift = await db.shift.findUnique({ where: { id } });

        if (!shift) {
            throw BaseError.notFound("Shift not found");
        }

        return shift;
    }

    async create(data) {
        if (!data.name) {
            const stack = [{
                message: "Name is required.",
                path: ["name"]
            }];
            throw new joi.ValidationError("Invalid data", stack);
        }

        const created = await db.shift.create({ data });

        if (!created) {
            throw BaseError.badRequest("Failed to create shift");
        }

        return {
            message: "Shift created successfully",
            data: created
        };
    }

    async update(id, data) {
        const existing = await db.shift.findUnique({ where: { id } });

        if (!existing) {
            throw BaseError.notFound("Shift not found");
        }

        const updated = await db.shift.update({
            where: { id },
            data
        });

        if (!updated) {
            throw BaseError.badRequest("Failed to update shift");
        }

        return {
            message: "Shift updated successfully",
            data: updated
        };
    }

    async delete(id) {
        const existing = await db.shift.findUnique({ where: { id } });

        if (!existing) {
            throw BaseError.notFound("Shift not found");
        }

        const deleted = await db.shift.delete({
            where: { id }
        });

        if (!deleted) {
            throw BaseError.badRequest("Failed to delete shift");
        }

        return {
            message: "Shift deleted successfully",
            data: deleted
        };
    }
}

export default new ShiftService();
