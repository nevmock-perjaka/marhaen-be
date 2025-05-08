import { successResponse } from "../../utils/response.js";
import EmployeeService from "./employee-service.js";

class EmployeeController {

    // EMPLOYEE SECTION
    async getAll(req, res) {
        const result = await EmployeeService.getAll();
        return successResponse(res, result);
    }

    async getById(req, res) {
        const { id } = req.params;
        const result = await EmployeeService.getById(id);
        return successResponse(res, result);
    }

    async create(req, res) {
        const result = await EmployeeService.create(req.body);
        return successResponse(res, result);
    }

    async update(req, res) {
        const { id } = req.params;
        const result = await EmployeeService.update(id, req.body);
        return successResponse(res, result);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await EmployeeService.delete(id);
        return successResponse(res, result);
    }

}

export default new EmployeeController();
