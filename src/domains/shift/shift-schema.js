import Joi from "joi";

// Untuk assign staff ke shift
export const assignStaffSchema = Joi.object({
    staff_id: Joi.string().uuid().required(),
    shift_name: Joi.string().required(),
    start_time: Joi.date().iso().required(),
    end_time: Joi.date().iso().required()
});

// Untuk log staff IN/OUT di shift
export const logStaffShiftSchema = Joi.object({
    staff_id: Joi.string().uuid().required(),
    shift_name: Joi.string().required(),
    action: Joi.string().valid("IN", "OUT").required(),
    timestamp: Joi.date().iso().required()
});