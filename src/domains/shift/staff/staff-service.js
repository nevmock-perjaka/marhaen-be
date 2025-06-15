import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class StaffService {
    async create(data) {
        return db.staff.create({ data });
    }

    async findAll(userId) {
        return db.staff.findMany({
            where: { 
                owned_by: userId 
            },
            include: {
                Shift: true,
            },
        });
    }

    async findById(id, userId) {
        const staff = await db.staff.findUnique({ 
            where: { id },
            include: {
                Shift: true,
                Order: true,
            }
        });
        if (!staff) throw BaseError.notFound("Staff not found.");
        if (staff.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this staff.");

        return staff;
    }

    async update(id, data) {
        await this.checkPermission(id, data.owned_by)

        return db.staff.update({ where: { id }, data });
    }

    async delete(id, userId) {
        await this.checkPermission(id, userId);

        return db.staff.delete({ where: { id } });
    }

    async checkPermission(id, userId) {
        const staff = await db.staff.findUnique({ where: { id } });
        if (!staff) throw BaseError.notFound("Staff not found.");
        if (staff.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this staff.");
    }
}

export default new StaffService();