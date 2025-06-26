import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const ingredientCostSchema = {
    params: Joi.object({
        start_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
        end_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
    })
}

export default ingredientCostSchema;