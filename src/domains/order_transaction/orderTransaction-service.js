import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";

class OrderTransactionService {
	async findAll() {
		return await db.order_transaction.findMany({
			include: {
				order: true,
			},
		});
	}

	async findById(orderTransactionId) {
		const trx = await db.order_transaction.findUnique({
			where: { id: orderTransactionId },
			include: {
				order: true,
			},
		});

		if (!trx) throw BaseError.notFound("Order transaction tidak ditemukan.");
		return trx;
	}

	async create(data) {
		return await db.order_transaction.create({ data });
	}

	async update(orderTransactionId, data) {
		return await db.order_transaction.update({
			where: { id: orderTransactionId },
			data,
		});
	}

	async delete(orderTransactionId) {
		return await db.order_transaction.delete({
			where: { id: orderTransactionId },
		});
	}
}

export default new OrderTransactionService();
