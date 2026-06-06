import Joi from "joi";

const createTransactionSchema = Joi.object({
	user_id: Joi.string().required().messages({
		"string.empty": "User ID is required.",
	}),
	amount: Joi.number().required().messages({
		"number.base": "Amount must be a number.",
		"any.required": "Amount is required.",
	}),
	type: Joi.string().valid("deposit", "purchase").required().messages({
		"any.only": "Type must be either 'deposit' or 'purchase'.",
	}),
	status: Joi.string().valid("pending", "completed").required().messages({
		"any.only": "Status must be 'pending' or 'completed'.",
	}),
	description: Joi.string().optional(),
});

const updateTransactionSchema = Joi.object({
	amount: Joi.number().optional(),
	type: Joi.string().valid("deposit", "purchase").optional(),
	status: Joi.string().valid("pending", "completed").optional(),
	description: Joi.string().optional(),
});

export { createTransactionSchema, updateTransactionSchema };
