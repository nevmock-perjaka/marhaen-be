import Joi from "joi";

const orderSchema = {
    // Schema untuk membuat Order
    create: Joi.object({
        order_by: Joi.string().required(),
        phone_number: Joi.string().allow(null, ""),
        status: Joi.string().required(), // contoh: "pending", "paid", dll.
        total_gross: Joi.number().precision(2).min(0).required(),
        table_id: Joi.string().allow(null, ""),
        discount_id: Joi.string().allow(null, ""),
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema untuk update Order
    update: Joi.object({
        order_by: Joi.string().optional(),
        phone_number: Joi.string().allow(null, "").optional(),
        status: Joi.string().optional(),
        total_gross: Joi.number().precision(2).min(0).optional(),
        table_id: Joi.string().allow(null, "").optional(),
        discount_id: Joi.string().allow(null, "").optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default orderSchema;
