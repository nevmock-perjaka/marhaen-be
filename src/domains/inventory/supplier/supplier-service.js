import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class SupplierService {
    async findAll(userId) {
        return await db.supplier.findMany({
            where: {
                owned_by: userId
            },
            include: {
                Input_history: true,
            },
        });
    }

    async findById(id, userId) {
        const supplier = await db.supplier.findUnique({
            where: { id },
            include: {
                Input_history: true,
            },
        });

        if (!supplier) {
            throw BaseError.notFound("Supplier not found.");
        }

        if (supplier.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this supplier.");
        }

        return supplier;
    }

    async create(data) {
        return await db.supplier.create({ data });
    }

    async update(id, data) {
        await this.checkPermission(id, data.owned_by)

        return await db.supplier.update({
            where: { id },
            data,
        });
    }

    async delete(id, userId) {
        await this.checkPermission(id, userId)

        return await db.supplier.delete({
            where: { id }
        });
    }

    async checkPermission(id, userId) {
        const supplier = await db.supplier.findUnique({
            where: { id },
        });

        if (!supplier) {
            throw BaseError.notFound("Supplier not found.");
        }

        if (supplier.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this supplier.");
        }
    }
}

export default new SupplierService();
