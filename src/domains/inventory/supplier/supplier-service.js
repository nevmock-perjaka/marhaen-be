import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class SupplierService {
    async findAll() {
        return await db.supplier.findMany({
            include: {
                Input_history: true,
            },
        });
    }

    async findById(id) {
        const supplier = await db.supplier.findUnique({
            where: { id },
            include: {
                Input_history: true,
            },
        });

        if (!supplier) {
            throw BaseError.notFound("Supplier tidak ditemukan.");
        }

        return supplier;
    }

    async create(data) {
        return await db.supplier.create({ data });
    }

    async update(id, data) {
        return await db.supplier.update({
            where: { id },
            data,
        });
    }

    async softDelete(id) {
        return await db.supplier.update({
            where: { id },
            data: { Status: false }
        });
    }
}

export default new SupplierService();
