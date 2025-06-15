import Joi from "joi";

const staffSchema = {
    create: Joi.object({
        name: Joi.string().required(),
        phone_number: Joi.string().required(),
        is_active: Joi.boolean().default(true)
    }),
    update: Joi.object({
        name: Joi.string().optional(),
        phone_number: Joi.string().optional(),
        is_active: Joi.boolean().optional()
    })
}

export default staffSchema;