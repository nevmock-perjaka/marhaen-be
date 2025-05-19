import Joi from "joi";

const supplierSchema = {
    // Schema untuk create supplier
    create: Joi.object({
        name: Joi.string().min(1).max(100).required(),
        description: Joi.string().allow("").optional(),
        address: Joi.string().required(),
        phone_number: Joi.string().pattern(/^[0-9+\-\s]{7,15}$/).required(),
        Status: Joi.boolean().default(true),
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema untuk update supplier
    update: Joi.object({
        name: Joi.string().min(1).max(100).optional(),
        description: Joi.string().allow("").optional(),
        address: Joi.string().optional(),
        phone_number: Joi.string().pattern(/^[0-9+\-\s]{7,15}$/).optional(),
        Status: Joi.boolean().optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default supplierSchema;
