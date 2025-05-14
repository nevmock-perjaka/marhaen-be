import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class TableService {
    async findAll() {
        return await db.table.findMany({
            include: {
                Order: true
            }
        });
    }

    async findById(id) {
        const table = await db.table.findUnique({
            where: { id },
            include: {
                Order: true
            }
        });

        if (!table) {
            throw BaseError.notFound("Meja tidak ditemukan.");
        }

        return table;
    }

    async create(data) {
        return await db.table.create({ data });
    }

    async update(id, data) {
        return await db.table.update({
            where: { id },
            data
        });
    }

    async softDelete(id) {
        return await db.table.update({
            where: { id },
            data: { is_active: false }
        });
    }
}

export default new TableService();
