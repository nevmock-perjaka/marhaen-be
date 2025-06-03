import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class StaffService {
    async createStaff(data) {
        return db.staff.create({ data });
    }

    async getStaffs() {
        return db.staff.findMany();
    }

    async getStaffById(id) {
        const staff = await db.staff.findUnique({ where: { id } });
        if (!staff) throw BaseError.notFound("Staff tidak ditemukan.");
        return staff;
    }

    async updateStaff(id, data) {
        return db.staff.update({ where: { id }, data });
    }

    async deleteStaff(id) {
        return db.staff.delete({ where: { id } });
    }
}

export default new StaffService();