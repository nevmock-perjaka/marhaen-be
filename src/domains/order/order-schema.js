import Joi from "joi";

const orderSchema = {
    // Schema untuk membuat Order
    create: Joi.object({
        order_by: Joi.string().required(),
        phone_number: Joi.string().optional().allow(null, ""),
        table_id: Joi.string().optional().allow(null, ""),
        shareable_code: Joi.string().optional().allow(null, ""),
        order_items: Joi.array().items(Joi.object({
            product_id: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
            note: Joi.string().allow("").optional(),
            order_item_add_ons: Joi.array().items(Joi.string()).optional().default([])
        })).required().min(1),
    }),
};

export default orderSchema;
