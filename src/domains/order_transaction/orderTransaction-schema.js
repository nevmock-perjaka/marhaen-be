import Joi from "joi";

const orderTransactionSchema = {
    // Schema untuk create
    create: Joi.object({
        transaction_id: Joi.string().required(),
        order_id: Joi.string().required(),
        gross_amount: Joi.number().precision(2).min(0).required(),
        payment_method: Joi.string().required(),
        admin_fee: Joi.number().precision(2).min(0).required(),
        status: Joi.string().required(), // e.g. 'pending', 'paid', 'failed'
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema untuk update
    update: Joi.object({
        gross_amount: Joi.number().precision(2).min(0).optional(),
        payment_method: Joi.string().optional(),
        admin_fee: Joi.number().precision(2).min(0).optional(),
        status: Joi.string().optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default orderTransactionSchema;
