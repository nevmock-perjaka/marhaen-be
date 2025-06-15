import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class StaffLogService {
    async getStaffLogs(userId) {
        return db.staff_log.findMany({
            where: { owned_by: userId },
            include: {
                staff: true,
            }
        });
    }

    async getStaffLogById(id, userId) {
        let log = await db.staff_log.findUnique({ where: { id },
            include: {
                staff: true,
            }
        });
        if (!log) throw BaseError.notFound("Staff log not found.");
        if (log.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this staff log.");

        const start = new Date(log.start_timestamp);
        const end = new Date(log.end_timestamp);

        const totalShift = (end - start) / (1000 * 60);
        log.total_shift_minute = totalShift.toFixed(2);
        return log;
    }
}

export default new StaffLogService();