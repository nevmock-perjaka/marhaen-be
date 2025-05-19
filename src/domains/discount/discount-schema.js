import Joi from "joi";

const discountSchema = {
    // Schema untuk create Discount
    create: Joi.object({
        name: Joi.string().required(),
        is_percentage: Joi.boolean().default(false),
        value: Joi.number().precision(2).min(0).required(),
        min_order_amount: Joi.number().precision(2).min(0).required(),
        shareable_code: Joi.string().required(),
        max_use: Joi.number().integer().min(1).optional(),
        used: Joi.number().integer().min(0).default(0),
        start_at: Joi.date().required(),
        expired_at: Joi.date().required(),
        is_active: Joi.boolean().default(true),
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema untuk update Discount
    update: Joi.object({
        name: Joi.string().optional(),
        is_percentage: Joi.boolean().optional(),
        value: Joi.number().precision(2).min(0).optional(),
        min_order_amount: Joi.number().precision(2).min(0).optional(),
        shareable_code: Joi.string().optional(),
        max_use: Joi.number().integer().min(1).optional(),
        used: Joi.number().integer().min(0).optional(),
        start_at: Joi.date().optional(),
        expired_at: Joi.date().optional(),
        is_active: Joi.boolean().optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default discountSchema;
