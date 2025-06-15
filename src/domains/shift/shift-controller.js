import { createdResponse, successResponse } from "../../utils/response.js";
import shiftService from "./shift-service.js";

class ShiftController {
    async clockIn(req, res) {
        const { staff_id } = req.body;
        const userId = req.user.id;
        const profileId = req.profile.id;
        const result = await shiftService.clockIn(staff_id, userId, profileId);

        return createdResponse(res, result);
    }

    async clockOut(req, res) {
        const userId = req.user.id;
        const profileId = req.profile.id;
        const result = await shiftService.clockOut(userId, profileId);
        return successResponse(res, result);
    }

    async getActiveShift(req, res) {
        const userId = req.user.id;
        const result = await shiftService.getActiveShift(userId);
        return successResponse(res, result);
    }

    async getStaffLogs(req, res) {
        const { staff_id } = req.query;
        const result = await shiftService.getStaffLogs(staff_id);
        res.status(200).json(result);
    }
}

export default new ShiftController();