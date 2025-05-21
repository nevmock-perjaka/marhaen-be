import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class InputHistoryService {
    async findAll() {
        return await db.input_history.findMany({
            include: {
                inventory: true,
                supplier: true,
            },
        });
    }

    async findById(id) {
        const history = await db.input_history.findUnique({
            where: { id },
            include: {
                inventory: true,
                supplier: true,
            },
        });

        if (!history) {
            throw BaseError.notFound("Riwayat input tidak ditemukan.");
        }

        return history;
    }

    async create(data) {
        return await db.input_history.create({ data });
    }

    async update(id, data) {
        return await db.input_history.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return await db.input_history.delete({
            where: { id },
        });
    }
}

export default new InputHistoryService();
