import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const inputHistorySchema = {
    // Schema untuk create Input_history
    create: Joi.object({
        supplier_id: Joi.string().required(),
        inventory_id: Joi.string().required(),
        shipping_fee: Joi.number().precision(2).min(0).required(),
        price: Joi.number().precision(2).min(0).required(),
        total_stock: Joi.number().integer().min(1).required(),
        input_datetime: Joi.date().format("YYYY-MM-DD").required(),
    }),

    // Schema untuk update Input_history
    update: Joi.object({
        shipping_fee: Joi.number().precision(2).min(0).optional(),
        price: Joi.number().precision(2).min(0).optional(),
        total_stock: Joi.number().integer().min(1).optional(),
        input_datetime: Joi.date().optional(),
    })
};

export default inputHistorySchema;
