import Joi from "joi";

const supplierSchema = {
    // Schema untuk create supplier
    create: Joi.object({
        name: Joi.string().min(1).max(100).required(),
        description: Joi.string().allow("").optional(),
        address: Joi.string().required(),
        phone_number: Joi.string().pattern(/^[0-9+\-\s]{7,15}$/).required(),
        status: Joi.boolean().default(true)
    }),

    // Schema untuk update supplier
    update: Joi.object({
        name: Joi.string().min(1).max(100).optional(),
        description: Joi.string().allow("").optional(),
        address: Joi.string().optional(),
        phone_number: Joi.string().pattern(/^[0-9+\-\s]{7,15}$/).optional(),
        status: Joi.boolean().optional(),
    })
};

export default supplierSchema;
