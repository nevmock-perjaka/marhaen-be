import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";

class ShiftService {
    // Clock in: waktu otomatis dari backend
    async clockIn(staff_id, userId, profileId) {
        console.log(`[clockIn] Attempting to clock in. staff_id: ${staff_id}, userId: ${userId}, profileId: ${profileId}`);
        
        const staff = await db.staff.findUnique({ where: { id: staff_id } });
        if (!staff) throw BaseError.notFound("Staff not found.");
        if (staff.owned_by !== userId) throw BaseError.forbidden("You are not allowed to clock in for this staff.");

        // Cek jika sudah clock in hari ini (tanpa clock out)
        const existing = await db.staff_log.findFirst({
            where: {
                owned_by: userId,
                end_timestamp: null,
            },
            orderBy: { start_timestamp: "desc" }
        });

        if (existing) {
            console.log(`[clockIn] Already clocked in. Existing log id: ${existing.id}`);
            throw BaseError.badRequest("Staff already clocked in today. Please clock out first.");
        }

        const result = await db.staff_log.create({
            data: {
                staff_id,
                start_timestamp: new Date(),
                owned_by: userId,
                created_by: profileId,
                updated_by: profileId
            }
        });
        
        console.log(`[clockIn] Successfully created shift log: ${result.id}`);
        return result;
    }

    // Clock out: waktu otomatis dari backend
    async clockOut(userId, profileId) {
        console.log(`[clockOut] Attempting to clock out for userId: ${userId}, profileId: ${profileId}`);
        
        const log = await db.staff_log.findFirst({
            where: {
                owned_by: userId,
                end_timestamp: { equals: null } // ✅
            },
            orderBy: { start_timestamp: "desc" }
        });

        console.log(`[clockOut] Found active shift: ${log ? log.id : 'NONE'}`);
        
        if (!log) {
            console.log(`[clockOut] No active shift found for userId: ${userId}. All staff_logs:`, 
                await db.staff_log.findMany({ where: { owned_by: userId } }));
            throw BaseError.badRequest("Staff is not clocked in. Please clock in first.");
        }

        return db.staff_log.update({
            where: { id: log.id },
            data: { 
                end_timestamp: new Date(),
                updated_by: profileId
            } // waktu backend
        });
    }

    async getStaffLogs(staff_id) {
        const where = staff_id ? { staff_id } : {};
        return db.staff_log.findMany({
            where,
            orderBy: { start_timestamp: "desc" }
        });
    }

    async getActiveShift(userId) {
        let is_shift_exist = false;
        const activeShift = await db.staff_log.findFirst({
            where: {
                owned_by: userId,
                end_timestamp: null, // Hanya ambil yang belum clock out
            },
            orderBy: { start_timestamp: "desc" }
        });

        if (activeShift) is_shift_exist = true;

        return {
            is_shift_exist,
            activeShift: activeShift || null
        };
    }
}

export default new ShiftService();