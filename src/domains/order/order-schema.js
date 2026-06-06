import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const orderSchema = {
    create: Joi.object({
        order_by: Joi.string().required(),
        phone_number: Joi.string().optional().allow(null, ""),
        table_id: Joi.string().optional().allow(null, ""),
        discount_id: Joi.string().optional().allow(null, ""),
        order_items: Joi.array().items(Joi.object({
            product_id: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
            note: Joi.string().allow("").optional(),
            order_item_add_ons: Joi.array().items(Joi.string()).optional().default([])
        })).required().min(1),
    }),

    update: Joi.object({
        order_by: Joi.string().optional(),
        phone_number: Joi.string().allow(null, "").optional(),
        status: Joi.string().optional(),
        total_gross: Joi.number().precision(2).min(0).optional(),
        table_id: Joi.string().allow(null, "").optional(),
        discount_id: Joi.string().allow(null, "").optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    }),
};

export default orderSchema;
