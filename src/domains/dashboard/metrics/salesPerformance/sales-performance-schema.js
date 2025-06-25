import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const salesPerformanceSchema = {
    params: Joi.object({
        start_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
        end_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
    })
}

export default salesPerformanceSchema;