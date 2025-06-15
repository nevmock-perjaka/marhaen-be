import staffService from "./staff-service.js";

class StaffController {
    async createStaff(req, res, next) {
        try {
            const data = req.body;
            const staff = await staffService.createStaff(data);
            res.status(201).json({ message: "Staff berhasil dibuat.", data: staff });
        } catch (err) {
            next(err);
        }
    }

    async getStaffs(req, res, next) {
        try {
            const staffs = await staffService.getStaffs();
            res.json(staffs);
        } catch (err) {
            next(err);
        }
    }

    async getStaffById(req, res, next) {
        try {
            const { staffId } = req.params;
            const staff = await staffService.getStaffById(staffId);
            res.json(staff);
        } catch (err) {
            next(err);
        }
    }

    async updateStaff(req, res, next) {
        try {
            const { staffId } = req.params;
            const data = req.body;
            const updated = await staffService.updateStaff(staffId, data);
            res.json({ message: "Staff berhasil diupdate.", data: updated });
        } catch (err) {
            next(err);
        }
    }

    async deleteStaff(req, res, next) {
        try {
            const { staffId } = req.params;
            await staffService.deleteStaff(staffId);
            res.json({ message: "Staff berhasil dihapus." });
        } catch (err) {
            next(err);
        }
    }
}

export default new StaffController();