import Joi from "joi";

const createShiftSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required."
    }),
    start_time: Joi.string().required().messages({
        "string.empty": "Start time is required."
    }),
    end_time: Joi.string().required().messages({
        "string.empty": "End time is required."
    })
});

const updateShiftSchema = Joi.object({
    name: Joi.string().optional(),
    start_time: Joi.string().optional(),
    end_time: Joi.string().optional()
});

export { createShiftSchema, updateShiftSchema };
