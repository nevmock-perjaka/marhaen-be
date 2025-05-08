import Joi from "joi";

const createEmployeeSchema = Joi.object({
    user_id: Joi.string().required(),
    shift_id: Joi.string().optional(),
    name: Joi.string().required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    position: Joi.string().optional()
});

const updateEmployeeSchema = Joi.object({
    shift_id: Joi.string().optional(),
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    position: Joi.string().optional()
});

export { createEmployeeSchema, updateEmployeeSchema };
