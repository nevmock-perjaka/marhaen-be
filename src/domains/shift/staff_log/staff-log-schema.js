import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

export const staffLogSchema = Joi.object({
    staff_id: Joi.string().uuid().required(),
    start_timestamp: Joi.date().format("YYYY-MM-DD hh:mm:ss").required(),
    end_timestamp: Joi.date().format("YYYY-MM-DD hh:mm:ss").required(),
});