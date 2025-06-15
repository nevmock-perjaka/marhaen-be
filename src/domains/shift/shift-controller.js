import shiftService from "./shift-service.js";

class ShiftController {
    async clockIn(req, res, next) {
        try {
            const { staff_id, owned_by } = req.body;
            const result = await shiftService.clockIn(staff_id, owned_by);
            res.status(201).json({ message: "Clock in berhasil.", data: result });
        } catch (err) {
            next(err);
        }
    }

    async clockOut(req, res, next) {
        try {
            const { staff_id } = req.body;
            const result = await shiftService.clockOut(staff_id);
            res.status(200).json({ message: "Clock out berhasil.", data: result });
        } catch (err) {
            next(err);
        }
    }

    async getStaffLogs(req, res, next) {
        try {
            const { staff_id } = req.query;
            const result = await shiftService.getStaffLogs(staff_id);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new ShiftController();