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

const changePinSchema = Joi.object({
  old_pin: Joi.string()
    .pattern(/^\d+$/)
    .min(6)
    .max(6)
    .required()
    .messages({
      'string.base': 'Old PIN must be a string.',
      'string.pattern.base': 'Old PIN must contain only digits.',
      'string.min': 'Old PIN must be at least 6 digits.',
      'string.max': 'Old PIN must be at most 6 digits.',
      'any.required': 'Old PIN is required.'
    }),
  new_pin: Joi.string()
    .pattern(/^\d+$/)
    .min(6)
    .max(6)
    .required()
    .messages({
      'string.base': 'New PIN must be a string.',
      'string.pattern.base': 'New PIN must contain only digits.',
      'string.min': 'New PIN must be at least 6 digits.',
      'string.max': 'New PIN must be at most 6 digits.',
      'any.required': 'New PIN is required.'
    })
});

export { loginSchema };