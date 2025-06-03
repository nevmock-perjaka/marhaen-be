import Joi from "joi";

export const staffLogSchema = Joi.object({
    staff_id: Joi.string().uuid().required(),
    shift_id: Joi.string().uuid().required(),
    action: Joi.string().valid("IN", "OUT").required(),
    timestamp: Joi.date().required()
});