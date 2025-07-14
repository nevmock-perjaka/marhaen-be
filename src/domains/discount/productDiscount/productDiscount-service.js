import BaseError from "../../../base_classes/base-error.js";
import db from "../../../config/db.js";

class ProductDiscountService {
	async findAll() {
		return await db.product_discount.findMany({
			include: {
				product: true,
				discount: true,
			},
		});
	}

	async findById(id) {
		const data = await db.product_discount.findUnique({
			where: { id },
			include: {
				product: true,
				discount: true,
			},
		});

		if (!data) {
			throw BaseError.notFound("Relasi produk dan diskon tidak ditemukan.");
		}

		return data;
	}

	async create(data) {
		return await db.product_discount.create({ data });
	}

	async update(id, data) {
		return await db.product_discount.update({
			where: { id },
			data,
		});
	}

	async delete(id) {
		return await db.product_discount.delete({
			where: { id },
		});
	}
}

export default new ProductDiscountService();
