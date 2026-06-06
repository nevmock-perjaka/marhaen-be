import Joi from "joi";

const dashboardSummarySchema = Joi.object({
	start: Joi.date().iso().optional().label("Start date"),
	end: Joi.date().iso().optional().label("End date"),
});

export { dashboardSummarySchema };
