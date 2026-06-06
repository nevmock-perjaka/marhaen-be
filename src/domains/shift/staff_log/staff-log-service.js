import BaseError from "../../../base_classes/base-error.js";
import db from "../../../config/db.js";
import { buildQueryOptions } from "../../../utils/buildQueryOptions.js";
import staffLogQueryConfig from "./staff-log-query-config.js";

class StaffLogService {
	async getStaffLogs(userId, query) {
		const options = buildQueryOptions(staffLogQueryConfig, query, userId);

		// Handle advSearch
		if (query?.advSearch) {
			if (query?.advSearch?.shift_date) {
				const shiftDate = new Date(query.advSearch.shift_date);
				const startOfDay = new Date(
					shiftDate.getFullYear(),
					shiftDate.getMonth(),
					shiftDate.getDate(),
					0,
					0,
					0,
				);
				const endOfDay = new Date(
					shiftDate.getFullYear(),
					shiftDate.getMonth(),
					shiftDate.getDate(),
					23,
					59,
					59,
				);
				options.where.AND = [
					...(options.where.AND || []),
					{
						start_timestamp: {
							gte: startOfDay,
							lte: endOfDay,
						},
					},
				];
			}
		}

		const [data, count] = await Promise.all([
			db.staff_log.findMany(options),
			db.staff_log.count({
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

	async getStaffLogById(id, userId) {
		const log = await db.staff_log.findUnique({
			where: { id },
			include: {
				staff: true,
			},
		});
		if (!log) throw BaseError.notFound("Staff log not found.");
		if (log.owned_by !== userId)
			throw BaseError.forbidden(
				"You are not allowed to access this staff log.",
			);

		const start = new Date(log.start_timestamp);
		const end = new Date(log.end_timestamp);

		const totalShift = (end - start) / (1000 * 60);
		log.total_shift_minute = totalShift.toFixed(2);
		return log;
	}

	async todayStaffLogs(userId) {
		const now = new Date();
		const startOfDay = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			0,
			0,
			0,
		);
		const endOfDay = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			23,
			59,
			59,
		);

		const logs = await db.staff_log.findMany({
			where: {
				owned_by: userId,
				AND: [
					{
						start_timestamp: { lt: endOfDay }, // dimulai sebelum akhir hari ini
					},
					{
						OR: [
							{ end_timestamp: null }, // masih clock-in
							{ end_timestamp: { gte: startOfDay } }, // berakhir setelah awal hari ini
						],
					},
				],
			},
			include: {
				staff: true,
			},
			orderBy: {
				start_timestamp: "desc",
			},
		});

		const result = logs.map((log) => {
			const shiftStart = new Date(log.start_timestamp);
			const shiftEnd = log.end_timestamp ? new Date(log.end_timestamp) : now;

			const effectiveStart = shiftStart < startOfDay ? startOfDay : shiftStart;
			const effectiveEnd = shiftEnd > endOfDay ? endOfDay : shiftEnd;

			const durationMs = effectiveEnd.getTime() - effectiveStart.getTime();
			const durationMinutes = Math.max(0, Math.floor(durationMs / 1000 / 60));

			return {
				staff_name: log.staff?.name || "-",
				phone_number: log.staff?.phone_number || "-",
				shift_duration_minutes: durationMinutes,
				is_on_shift: log.end_timestamp === null,
				start_timestamp: log.start_timestamp,
				end_timestamp: log.end_timestamp,
			};
		});

		return result;
	}
}

export default new StaffLogService();
