import BaseError from "../../../base_classes/base-error.js";
import db from "../../../config/db.js";

class OrderItemAddonService {
	async findAll() {
		return await db.order_item_add_on.findMany({
			include: {
				product: true,
				order: true,
			},
		});
	}

	async findById(orderItemAddonId) {
		const addon = await db.order_item_add_on.findUnique({
			where: { id: orderItemAddonId },
			include: {
				product: true,
				order: true,
			},
		});

		if (!addon) throw BaseError.notFound("Order item add-on tidak ditemukan.");
		return addon;
	}

	async create(data) {
		return await db.order_item_add_on.create({ data });
	}

	async update(orderItemAddonId, data) {
		return await db.order_item_add_on.update({
			where: { id: orderItemAddonId },
			data,
		});
	}

	async delete(orderItemAddonId) {
		return await db.order_item_add_on.delete({
			where: { id: orderItemAddonId },
		});
	}
}

export default new OrderItemAddonService();
