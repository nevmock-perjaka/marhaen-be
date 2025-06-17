import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";

class StaffService {
    async create(data) {
        return db.staff.create({ data });
    }

    async findAll(userId) {
        const result = await db.$queryRawUnsafe(`
            SELECT 
                s.id AS staff_id,
                s.name,
                s.phone_number,
                s.is_active,
                SUM(EXTRACT(EPOCH FROM (sl.end_timestamp - sl.start_timestamp)) / 60)::int AS total_shift_minutes
            FROM 
                "Staff" s
            LEFT JOIN 
                "Staff_log" sl ON s.id = sl.staff_id AND sl.end_timestamp IS NOT NULL
            WHERE 
                s.owned_by = $1
            GROUP BY 
                s.id, s.name, s.phone_number, s.is_active
            `, userId);

        return result
    }

    async findById(id, userId) {
        const staff = await db.staff.findUnique({ 
            where: { id },
            include: {
                Staff_log: true
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