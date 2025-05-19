import Joi from "joi";

const orderItemSchema = {
    // Schema untuk membuat Order_item
    create: Joi.object({
        order_id: Joi.string().required(),
        product_id: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().precision(2).min(0).required(),
        note: Joi.string().allow(null, "").optional(),
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema untuk update Order_item
    update: Joi.object({
        quantity: Joi.number().integer().min(1).optional(),
        price: Joi.number().precision(2).min(0).optional(),
        note: Joi.string().allow(null, "").optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default orderItemSchema;
