import DiscountService from "./discount-service.js";
import { successResponse, createdResponse } from "../../utils/response.js";
import BaseError from "../../base_classes/base-error.js";
import discountSchema from "./discount-schema.js";
import Joi from "joi";
import path from "path";

class DiscountController {
    async getAll(req, res) {
        const userId =  req.user.id;
        const discounts = await DiscountService.findAll(userId);
        return successResponse(res, discounts);
    }

    async getById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const discount = await DiscountService.findById(id, userId);
        return successResponse(res, discount);
    }

    async create(req, res) {
        const value = req.body;
        
        value.owned_by = req.user.id;
        value.created_by = req.profile.id;
        value.updated_by = req.profile.id;
        value.used = 0;

        value.start_at = new Date(value.start_at);
        value.expired_at = new Date(value.expired_at);

        // console.log(new Date(), value.start_at);
        if (value.start_at < new Date()) {
            let validation = "";
            let stack = [];
            validation += "Start date must be greater than or equal to current date. ";

            stack.push({
                message: "Start date must be greater than or equal to current date.",
                path: ["start_at"]
            });

            throw new Joi.ValidationError(validation, stack);
        }

        if (value.start_at >= value.expired_at) {
            let validation = "";
            let stack = [];

            validation += "Start date must be less than expired date. ";

            stack.push({
                message: "Start date must be less than expired date.",
                path: ["start_at"]
            });

            stack.push({
                message: "Expired date must be greater than start date.",
                path: ["expired_at"]
            })

            throw new Joi.ValidationError(validation, stack);
        }

        const created = await DiscountService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        let value = req.body;

        value.updated_by = req.profile.id;
        value.owned_by = req.user.id;

        value.start_at = new Date(value.start_at);
        value.expired_at = new Date(value.expired_at);

        const updated = await DiscountService.update(id, value);
        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const deleted = await DiscountService.delete(id, userId);
        return successResponse(res, deleted);
    }
}

export default new DiscountController();
