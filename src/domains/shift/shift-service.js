import BaseError from "../../base_classes/base-error.js";
import db from "../../config/db.js";

class ShiftService {
	// Clock in: waktu otomatis dari backend
	async clockIn(staff_id, userId, profileId) {
		const staff = await db.staff.findUnique({ where: { id: staff_id } });
		if (!staff) throw BaseError.notFound("Staff not found.");
		if (staff.owned_by !== userId)
			throw BaseError.forbidden(
				"You are not allowed to clock in for this staff.",
			);

		// Cek jika sudah clock in hari ini (tanpa clock out)
		const existing = await db.staff_log.findFirst({
			where: {
				owned_by: userId,
				end_timestamp: null,
			},
			orderBy: { start_timestamp: "desc" },
		});

		if (existing)
			throw BaseError.badRequest(
				"Staff already clocked in today. Please clock out first.",
			);

		return await db.staff_log.create({
			data: {
				staff_id,
				start_timestamp: new Date(),
				owned_by: userId,
				created_by: profileId,
				updated_by: profileId,
			},
		});
	}

	// Clock out: waktu otomatis dari backend
	async clockOut(userId, profileId) {
		const log = await db.staff_log.findFirst({
			where: {
				owned_by: userId,
				end_timestamp: { equals: null }, // ✅
			},
			orderBy: { start_timestamp: "desc" },
		});

		if (!log)
			throw BaseError.badRequest(
				"Staff is not clocked in. Please clock in first.",
			);

		return db.staff_log.update({
			where: { id: log.id },
			data: {
				end_timestamp: new Date(),
				updated_by: profileId,
			}, // waktu backend
		});
	}

	async getStaffLogs(staff_id) {
		const where = staff_id ? { staff_id } : {};
		return db.staff_log.findMany({
			where,
			orderBy: { start_timestamp: "desc" },
		});
	}

	async getActiveShift(userId) {
		let is_shift_exist = false;
		const activeShift = await db.staff_log.findFirst({
			where: {
				owned_by: userId,
				end_timestamp: null, // Hanya ambil yang belum clock out
			},
			orderBy: { start_timestamp: "desc" },
		});

		if (activeShift) is_shift_exist = true;

		return {
			is_shift_exist,
			activeShift: activeShift || null,
		};
	}
}

export default new ShiftService();
