import { createdResponse, successResponse } from "../../../utils/response.js";
import staffService from "./staff-service.js";

class StaffController {
	async create(req, res) {
		const value = req.body;

		value.owned_by = req.user.id;
		value.created_by = req.profile.id;
		value.updated_by = req.profile.id;

		const created = await staffService.create(value);
		return createdResponse(res, created);
	}

	async getAll(req, res) {
		const userId = req.user.id;
		const query = req.query;
		const staffs = await staffService.findAll(userId, query);
		return successResponse(res, staffs.data, staffs.count, staffs.meta);
	}

	async getById(req, res) {
		const { staffId } = req.params;
		const userId = req.user.id;
		const staff = await staffService.findById(staffId, userId);
		return successResponse(res, staff);
	}

	async update(req, res) {
		const { staffId } = req.params;
		const value = req.body;

		value.updated_by = req.profile.id;
		value.owned_by = req.user.id;

		const updated = await staffService.update(staffId, value);
		return successResponse(res, updated);
	}

	async delete(req, res) {
		const { staffId } = req.params;
		const userId = req.user.id;
		const deleted = await staffService.delete(staffId, userId);
		return successResponse(res, deleted);
	}
}

export default new StaffController();
