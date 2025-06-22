import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";
import Joi from "joi";

class DiscountService {
    async findAll(userId) {
        return await db.discount.findMany({
            where: { 
                owned_by: userId
             },
            include: {
                Product_discount: true,
                Order: true,
            },
        });
    }

    async findById(id, userId) {
        const discount = await db.discount.findUnique({
            where: { id },
            include: {
                Product_discount: true,
                Order: true,
            },
        });

        if (!discount) {
            throw BaseError.notFound("Discount not found.");
        }

        if (discount.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this discount.");
        }

        return discount;
    }

    async create(data) {
        const existShareableCode = await db.discount.findFirst({
            where: {
                shareable_code: data.shareable_code,
                owned_by: data.owned_by,
            },
        });

        if (existShareableCode) throw BaseError.badRequest("Shareable code already exists.");

        return await db.discount.create({ data });
    }

    async update(id, data) {
        await this.checkPermission(id, data.owned_by);

        const existsDiscount = await this.findById(id, data.owned_by);

        if (existsDiscount.start_at.getTime() !== data.start_at.getTime()){
            if (data.start_at < new Date()) {
                let validation = "";
                let stack = [];
                validation += "Start date must be greater than or equal to current date. ";
    
                stack.push({
                    message: "Start date must be greater than or equal to current date.",
                    path: ["start_at"]
                });
    
                throw new Joi.ValidationError(validation, stack);
            }
        }

        if (data.start_at >= data.expired_at) {
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

        return await db.discount.update({
            where: { id },
            data,
        });
    }

    async delete(id, userId) {
        await this.checkPermission(id, userId);

        return await db.discount.delete({
            where: { id }
        });
    }

    async checkPermission(id, userId) {
        const discount = await db.discount.findUnique({
            where: { id },
        });

        if (!discount) {
            throw BaseError.notFound("Discount not found.");
        }

        if (discount.owned_by !== userId) {
            throw BaseError.forbidden("You are not allowed to access this discount.");
        }
    }
}

export default new DiscountService();
