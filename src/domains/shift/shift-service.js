import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";

class ShiftService {
    // Clock in: waktu otomatis dari backend
    async clockIn(staff_id, owned_by) {
        const staff = await db.staff.findUnique({ where: { id: staff_id } });
        if (!staff) throw BaseError.notFound("Staff tidak ditemukan.");

        // Cek jika sudah clock in hari ini (tanpa clock out)
        const now = new Date();
        const existing = await db.staff_log.findFirst({
            where: {
                staff_id,
                end_timestamp: { equals: null }, // ✅ Perbaikan di sini
                start_timestamp: {
                    gte: new Date(now.setHours(0, 0, 0, 0)),
                    lte: new Date(now.setHours(23, 59, 59, 999))
                }
            }
        });
        if (existing) throw BaseError.badRequest("Staff sudah clock in hari ini dan belum clock out.");

        return db.staff_log.create({
            data: {
                staff_id,
                start_timestamp: new Date(), // waktu backend
                owned_by
            }
        });
    }

    // Clock out: waktu otomatis dari backend
    async clockOut(staff_id) {
        const staff = await db.staff.findUnique({ where: { id: staff_id } });
        if (!staff) throw BaseError.notFound("Staff tidak ditemukan.");

        const log = await db.staff_log.findFirst({
            where: {
                staff_id,
                end_timestamp: { equals: null } // ✅
            },
            orderBy: { start_timestamp: "desc" }
        });
        if (!log) throw BaseError.badRequest("Belum ada clock in yang aktif untuk staff ini.");

        return db.staff_log.update({
            where: { id: log.id },
            data: { end_timestamp: new Date() } // waktu backend
        });
    }

    async getStaffLogs(staff_id) {
        const where = staff_id ? { staff_id } : {};
        return db.staff_log.findMany({
            where,
            orderBy: { start_timestamp: "desc" }
        });
    }
}

export default new ShiftService();