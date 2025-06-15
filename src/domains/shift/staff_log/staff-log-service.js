import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class StaffLogService {
    async createStaffLog(data) {
        return db.staff_log.create({ data });
    }

    async getStaffLogs() {
        return db.staff_log.findMany();
    }

    async getStaffLogById(id) {
        const log = await db.staff_log.findUnique({ where: { id } });
        if (!log) throw BaseError.notFound("Staff log tidak ditemukan.");
        return log;
    }

    async deleteStaffLog(id) {
        return db.staff_log.delete({ where: { id } });
    }
}

export default new StaffLogService();