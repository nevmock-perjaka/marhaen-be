import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const salesPerformanceSchema = {
	params: Joi.object({
		start_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
		end_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
	}),
};

export default salesPerformanceSchema;
