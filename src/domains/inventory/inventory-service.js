import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import inventoryQueryConfig from "./inventory-query-config.js";

class InventoryService {
	async findAll(userId, query) {
		const options = buildQueryOptions(inventoryQueryConfig, query, userId);

		const [data, count] = await Promise.all([
			db.inventory.findMany(options),
			db.inventory.count({
				where: options.where,
			}),
		]);

		const currentPage = query?.pagination?.page ?? 1;
		const itemsPerPage = query?.pagination?.limit ?? 10;
		const totalPages = Math.ceil(count / itemsPerPage);

		return {
			data,
			meta:
				query?.pagination?.page && query?.pagination?.limit
					? {
							totalItems: count,
							totalPages,
							currentPage,
							itemsPerPage,
						}
					: null,
			count: data.length,
		};
	}

	async findById(id, userId) {
		const inventory = await db.inventory.findUnique({
			where: { id },
			include: {
				Product_config: true,
				Add_on_config: true,
				Input_history: true,
			},
		});

		if (!inventory) {
			throw BaseError.notFound("Inventory not found.");
		}

		if (inventory.owned_by !== userId) {
			throw BaseError.forbidden(
				"You are not allowed to access this inventory.",
			);
		}

		return inventory;
	}

	async create(data) {
		return await db.inventory.create({ data });
	}

	async update(id, data) {
		await this.checkPermission(id, data.owned_by);

		return await db.inventory.update({
			where: { id },
			data,
		});
	}

	async delete(id, userId) {
		await this.checkPermission(id, userId);

		return await db.inventory.delete({
			where: { id },
		});
	}

	async checkPermission(id, userId) {
		const inventory = await db.inventory.findUnique({
			where: { id },
		});

		if (!inventory) {
			throw BaseError.notFound("Inventory not found.");
		}

		if (inventory.owned_by !== userId) {
			throw BaseError.forbidden(
				"You are not allowed to access this inventory.",
			);
		}
	}
}

export default new InventoryService();
