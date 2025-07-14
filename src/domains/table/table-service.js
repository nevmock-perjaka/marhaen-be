import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import tableQueryConfig from "./table-query-config.js";

class TableService {
	async findAll(userId, query) {
		const options = buildQueryOptions(tableQueryConfig, query, userId);

		const [data, count] = await Promise.all([
			db.table.findMany(options),
			db.table.count({
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
		const table = await db.table.findUnique({
			where: { id },
			include: {
				Order: true,
			},
		});

		if (!table) {
			throw BaseError.notFound("Table not found.");
		}

		if (table.owned_by !== userId) {
			throw BaseError.forbidden("You are not allowed to access this table.");
		}

		return table;
	}

	async create(data) {
		const identifier_table_exists = await db.table.findFirst({
			where: {
				identifier_table: data.identifier_table,
				owned_by: data.owned_by,
			},
		});

		if (identifier_table_exists) {
			throw BaseError.badRequest("Table with this identifier already exists.", [
				{
					message: "Table with this identifier already exists.",
					path: ["identifier_table"],
				},
			]);
		}

		return await db.table.create({ data });
	}

	async update(id, data) {
		await this.checkPermission(id, data.owned_by);

		if (data.identifier_table) {
			const identifier_table_exists = await db.table.findFirst({
				where: {
					identifier_table: data.identifier_table,
					owned_by: data.owned_by,
					id: { not: id }, // Exclude current table
				},
			});

			if (identifier_table_exists) {
				throw BaseError.badRequest(
					"Table with this identifier already exists.",
					[
						{
							message: "Table with this identifier already exists.",
						},
					],
				);
			}
		}

		return await db.table.update({
			where: { id },
			data,
		});
	}

	async delete(id, userId) {
		await this.checkPermission(id, userId);

		return await db.table.delete({
			where: { id },
		});
	}

	async checkPermission(id, userId) {
		const table = await db.table.findUnique({
			where: { id },
		});

		if (!table) {
			throw BaseError.notFound("Table not found.");
		}

		if (table.owned_by !== userId) {
			throw BaseError.forbidden("You are not allowed to access this table.");
		}
	}
}

export default new TableService();
