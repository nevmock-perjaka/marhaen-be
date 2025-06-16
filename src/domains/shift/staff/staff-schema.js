import Joi from "joi";

const staffSchema = {
    create: Joi.object({
        name: Joi.string().required(),
        phone_number: Joi.string().required().regex(/^\+?[0-9]{10,15}$/)
            .messages({
                "string.empty": "Phone number is required.",
                "string.pattern.base": "Phone number must be a valid phone number.",
            }),
        is_active: Joi.boolean().default(true)
    }),
    update: Joi.object({
        name: Joi.string().optional(),
        phone_number: Joi.string().optional().regex(/^\+?[0-9]{10,15}$/)
            .messages({
                "string.empty": "Phone number is required.",
                "string.pattern.base": "Phone number must be a valid phone number.",
            }),
        is_active: Joi.boolean().optional()
    })
}

export default staffSchema;