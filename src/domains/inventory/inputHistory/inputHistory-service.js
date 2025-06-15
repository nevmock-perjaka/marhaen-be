import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class InputHistoryService {
    async findAll(userId) {
        return await db.input_history.findMany({
            where: {
                owned_by: userId
            },
            include: {
                inventory: true,
                supplier: true,
            },
        });
    }

    async findById(id, userId) {
        const history = await db.input_history.findUnique({
            where: { id },
            include: {
                inventory: true,
                supplier: true,
            },
        });

        if (!history) {
            throw BaseError.notFound("History input not found.");
        }

        if (history.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this history input.");
        }

        return history;
    }

    async create(data) {
        // If input_datetime is provided, convert it to a Date object
        if (data.input_datetime) {
            data.input_datetime = new Date(data.input_datetime);
        }
        
        return await db.input_history.create({ data });
    }

    async update(id, data) {
        await this.checkPermission(id, data.owned_by)

        // If input_datetime is provided, convert it to a Date object
        if (data.input_datetime) {
            data.input_datetime = new Date(data.input_datetime);
        }

        return await db.input_history.update({
            where: { id },
            data,
        });
    }

    async delete(id, userId) {
        await this.checkPermission(id, userId)

        return await db.input_history.delete({
            where: { id },
        });
    }

    async checkPermission(id, userId) {
        const inputHistory = await db.input_history.findUnique({
            where: { id },
        });

        if (!inputHistory) {
            throw BaseError.notFound("Input History not found.");
        }

        if (inputHistory.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this Input History.");
        }
    }
}

export default new InputHistoryService();
