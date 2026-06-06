import BaseError from "../../../base_classes/base-error.js";
import db from "../../../config/db.js";
import { buildQueryOptions } from "../../../utils/buildQueryOptions.js";
import staffQueryConfig from "./staff-query-config.js";

class StaffService {
	async create(data) {
		const existPhoneNumber = await db.staff.findFirst({
			where: {
				phone_number: data.phone_number,
				owned_by: data.owned_by,
			},
		});

		if (existPhoneNumber)
			throw BaseError.badRequest("Phone number already exists.");

		return db.staff.create({ data });
	}

	async findAll(userId, query) {
		const options = buildQueryOptions(staffQueryConfig, query, userId);

		const withTotal = query?.advSearch?.with_total_shift_minutes;
		const shiftMonth = query?.advSearch?.shift_month
			? new Date(query.advSearch.shift_month)
			: null;
		const startOfMonth = shiftMonth
			? new Date(shiftMonth.getFullYear(), shiftMonth.getMonth(), 1, 0, 0, 0)
			: null;
		const endOfMonth = shiftMonth
			? new Date(
					shiftMonth.getFullYear(),
					shiftMonth.getMonth() + 1,
					0,
					23,
					59,
					59,
				)
			: null;

		if (withTotal || query?.include_relation?.includes("Staff_log")) {
			options.include = {
				...(options.include || {}),
				Staff_log: {
					where: {
						end_timestamp: { not: null },
						...(shiftMonth && {
							start_timestamp: {
								gte: startOfMonth,
								lte: endOfMonth,
							},
						}),
					},
				},
			};
		}

		const [data, count] = await Promise.all([
			db.staff.findMany(options),
			db.staff.count({
				where: options.where,
			}),
		]);

		const result = data.map((staff) => {
			const staffLog = staff.Staff_log || [];

			const totalMinutes = withTotal
				? staffLog.reduce((sum, log) => {
						const start = new Date(log.start_timestamp);
						const end = new Date(log.end_timestamp);
						return sum + (end - start) / 60000;
					}, 0)
				: null;

			return {
				staff_id: staff.id,
				name: staff.name,
				phone_number: staff.phone_number,
				is_active: staff.is_active,
				...(withTotal && {
					total_shift_minutes: Math.floor(totalMinutes),
				}),
				...(query?.include_relation?.reduce((acc, rel) => {
					if (staff[rel] !== undefined) {
						acc[rel] = staff[rel];
					}
					return acc;
				}, {}) || {}),
			};
		});

		const currentPage = query?.pagination?.page ?? 1;
		const itemsPerPage = query?.pagination?.limit ?? 10;
		const totalPages = Math.ceil(count / itemsPerPage);

		return {
			data: result,
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

		// const result = await db.$queryRawUnsafe(
		//   `
		//         SELECT
		//             s.id AS staff_id,
		//             s.name,
		//             s.phone_number,
		//             s.is_active,
		//             SUM(EXTRACT(EPOCH FROM (sl.end_timestamp - sl.start_timestamp)) / 60)::int AS total_shift_minutes
		//         FROM
		//             "Staff" s
		//         LEFT JOIN
		//             "Staff_log" sl ON s.id = sl.staff_id AND sl.end_timestamp IS NOT NULL
		//         WHERE
		//             s.owned_by = $1
		//         GROUP BY
		//             s.id, s.name, s.phone_number, s.is_active
		//         `,
		//   userId
		// );

		// return result;
	}

	async findById(id, userId) {
		const staff = await db.staff.findUnique({
			where: { id },
			include: {
				Staff_log: true,
			},
		});
		if (!staff) throw BaseError.notFound("Staff not found.");
		if (staff.owned_by !== userId)
			throw BaseError.forbidden("You are not allowed to access this staff.");

		return staff;
	}

	async update(id, data) {
		await this.checkPermission(id, data.owned_by);

		return db.staff.update({ where: { id }, data });
	}

	async delete(id, userId) {
		await this.checkPermission(id, userId);

		return db.staff.delete({ where: { id } });
	}

	async checkPermission(id, userId) {
		const staff = await db.staff.findUnique({ where: { id } });
		if (!staff) throw BaseError.notFound("Staff not found.");
		if (staff.owned_by !== userId)
			throw BaseError.forbidden("You are not allowed to access this staff.");
	}
}

export default new StaffService();
