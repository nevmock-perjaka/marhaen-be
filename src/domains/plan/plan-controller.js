import planService from "./plan-service.js";
import { createdResponse, successResponse } from "../../utils/response.js"
import BaseError from "../../base_classes/base-error.js";

class PlanController {
    async index(req, res) {
        const plans = await planService.getAll();

        return successResponse(res, plans.data, plans.total);
    }

    async show(req, res) {
        const { id } = req.params;

        const plan = await planService.getById(id);

        return successResponse(res, plan);
    }

    async create(req, res) {
        const { name, days, price, level } = req.body;

        const plan = await planService.create({
            name,
            days,
            price,
            level
        });

        return createdResponse(res, plan);
    }

    async update(req, res) {
        const { id } = req.params;

        if (!id){
            throw BaseError.badRequest("Id is required")
        }

        const data = req.body;

        const updatedPlan = await planService.update(id, data);

        return successResponse(res, updatedPlan);
    }

    async delete(req, res) {
        const { id } = req.params;

        if (!id){
            throw BaseError.badRequest("Id is required")
        }

        await planService.deleteById(id);

        return successResponse(res, { message: "Plan deleted successfully" })
    }
}

export default new PlanController();