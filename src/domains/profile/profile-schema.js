import Joi from "joi";

const loginSchema = Joi.object({
  profile_id: Joi.string().required().messages({
    'any.required': 'Profile ID is required.',
    'string.base': 'Profile ID must be a string.'
  }),
  pin: Joi.string()
    .pattern(/^\d+$/)
    .min(6)
    .max(6)
    .optional()
    .messages({
      'string.base': 'PIN must be a string.',
      'string.pattern.base': 'PIN must contain only digits.',
      'string.min': 'PIN must be at least 6 digits.',
      'string.max': 'PIN must be at most 6 digits.'
    })
});


export { loginSchema };