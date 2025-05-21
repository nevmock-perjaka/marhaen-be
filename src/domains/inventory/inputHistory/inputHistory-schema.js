import Joi from "joi";

const inputHistorySchema = {
    // Schema untuk create Input_history
    create: Joi.object({
        supplier_id: Joi.string().required(),
        inventory_id: Joi.string().required(),
        shipping_fee: Joi.number().precision(2).min(0).required(),
        price: Joi.number().precision(2).min(0).required(),
        total_stock: Joi.number().integer().min(1).required(),
        current_stock: Joi.number().integer().min(0).required(),
        input_datetime: Joi.date().required(),
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema untuk update Input_history
    update: Joi.object({
        shipping_fee: Joi.number().precision(2).min(0).optional(),
        price: Joi.number().precision(2).min(0).optional(),
        total_stock: Joi.number().integer().min(1).optional(),
        current_stock: Joi.number().integer().min(0).optional(),
        input_datetime: Joi.date().optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default inputHistorySchema;
