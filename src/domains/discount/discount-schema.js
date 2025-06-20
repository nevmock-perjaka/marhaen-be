import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const discountSchema = {
    // Schema untuk create Discount
    create: Joi.object({
        description: Joi.string().required(),
        is_percentage: Joi.boolean().default(false),
        value: Joi.alternatives().conditional('is_percentage', {
            is: true,
            then: Joi.number().precision(2).min(0).max(100).required(),
            otherwise: Joi.number().precision(2).min(0).required(),
        }),
        max_discount: Joi.number().precision(2).min(0).when('is_percentage', {
            is: true,
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
        min_order_amount: Joi.number().precision(2).min(0).required(),
        shareable_code: Joi.string().required(),
        max_use: Joi.number().integer().min(1).optional(),
        start_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
        expired_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
        is_active: Joi.boolean().default(true),
        
    }),

    // Schema untuk update Discount
    update: Joi.object({
        description: Joi.string().optional(),
        is_percentage: Joi.boolean().default(false),
        value: Joi.alternatives().conditional('is_percentage', {
            is: true,
            then: Joi.number().precision(2).min(0).max(100).required(),
            otherwise: Joi.number().precision(2).min(0).required(),
        }),
        max_discount: Joi.number().precision(2).min(0).when('is_percentage', {
            is: true,
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
        min_order_amount: Joi.number().precision(2).min(0).optional(),
        max_use: Joi.number().integer().min(1).optional(),
        start_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
        expired_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
        is_active: Joi.boolean().optional(),
    })
};

export default discountSchema;
