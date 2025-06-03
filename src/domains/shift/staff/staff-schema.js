import Joi from "joi";

export const staffSchema = Joi.object({
    name: Joi.string().required(),
    phone_number: Joi.string().required(),
    is_active: Joi.number().valid(0, 1).required(),
    owned_by: Joi.string().uuid().required()
});