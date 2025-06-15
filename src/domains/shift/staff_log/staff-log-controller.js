import staffLogService from "./staff-log-service.js";

class StaffLogController {
    async createStaffLog(req, res, next) {
        try {
            const data = req.body;
            const staffLog = await staffLogService.createStaffLog(data);
            res.status(201).json({ message: "Staff log berhasil dibuat.", data: staffLog });
        } catch (err) {
            next(err);
        }
    }

    async getStaffLogs(req, res, next) {
        try {
            const staffLogs = await staffLogService.getStaffLogs();
            res.json(staffLogs);
        } catch (err) {
            next(err);
        }
    }

    async getStaffLogById(req, res, next) {
        try {
            const { id } = req.params;
            const staffLog = await staffLogService.getStaffLogById(id);
            res.json(staffLog);
        } catch (err) {
            next(err);
        }
    }

    async deleteStaffLog(req, res, next) {
        try {
            const { id } = req.params;
            await staffLogService.deleteStaffLog(id);
            res.json({ message: "Staff log berhasil dihapus." });
        } catch (err) {
            next(err);
        }
    }
}

export default new StaffLogController();