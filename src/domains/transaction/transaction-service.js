import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";
import joi from "joi";

class TransactionService {
    async getAll() {
        return await db.transaction.findMany({
            include: {
                user: true
            }
        });
    }

    async getById(id) {
        const trx = await db.transaction.findUnique({
            where: { id },
            include: {
                user: true
            }
        });

        if (!trx) {
            throw BaseError.notFound("Transaction not found");
        }

        return trx;
    }

    async create(data) {
        const user = await db.user.findUnique({
            where: { id: data.user_id }
        });

        if (!user) {
            const stack = [{
                message: "User not found.",
                path: ["user_id"]
            }];
            throw new joi.ValidationError("Invalid user", stack);
        }

        const created = await db.transaction.create({ data });

        if (!created) {
            throw BaseError.badRequest("Failed to create transaction");
        }

        return {
            message: "Transaction created successfully",
            data: created
        };
    }

    async update(id, data) {
        const trx = await db.transaction.findUnique({ where: { id } });

        if (!trx) {
            throw BaseError.notFound("Transaction not found");
        }

        const updated = await db.transaction.update({
            where: { id },
            data
        });

        if (!updated) {
            throw BaseError.badRequest("Failed to update transaction");
        }

        return {
            message: "Transaction updated successfully",
            data: updated
        };
    }

    async delete(id) {
        const trx = await db.transaction.findUnique({ where: { id } });

        if (!trx) {
            throw BaseError.notFound("Transaction not found");
        }

        const deleted = await db.transaction.delete({ where: { id } });

        if (!deleted) {
            throw BaseError.badRequest("Failed to delete transaction");
        }

        return {
            message: "Transaction deleted successfully",
            data: deleted
        };
    }
}

export default new TransactionService();
