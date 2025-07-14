import Joi from "joi";

export const validateStockReduction = Joi.object({
	orderId: Joi.string().uuid().required(),
});

export const validateStockAddition = Joi.object({
	inputHistoryId: Joi.string().uuid().required(),
});
