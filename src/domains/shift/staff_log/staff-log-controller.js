import { successResponse } from "../../../utils/response.js";
import staffLogService from "./staff-log-service.js";

class StaffLogController {
    async getStaffLogs(req, res) {
        const userId = req.user.id;
        const staffLogs = await staffLogService.getStaffLogs(userId);
        return successResponse(res, staffLogs);
    }

    async getStaffLogById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const staffLog = await staffLogService.getStaffLogById(id, userId);
        return successResponse(res, staffLog);
    }
}

export default new StaffLogController();