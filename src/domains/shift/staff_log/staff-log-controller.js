import { successResponse } from "../../../utils/response.js";
import staffLogService from "./staff-log-service.js";

class StaffLogController {
  async getStaffLogs(req, res) {
    const userId = req.user.id;
    const query = req.query;
    const staffLogs = await staffLogService.getStaffLogs(userId, query);
    return successResponse(res, staffLogs.data, staffLogs.count, staffLogs.meta);
  }

  async getStaffLogById(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const staffLog = await staffLogService.getStaffLogById(id, userId);
    return successResponse(res, staffLog);
  }
}

export default new StaffLogController();
