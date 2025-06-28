import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const staffSchema = {
  create: Joi.object({
    name: Joi.string().required(),
    phone_number: Joi.string()
      .required()
      .regex(/^\+?[0-9]{10,15}$/)
      .messages({
        "string.empty": "Phone number is required.",
        "string.pattern.base": "Phone number must be a valid phone number.",
      }),
    is_active: Joi.boolean().default(true),
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    phone_number: Joi.string()
      .optional()
      .regex(/^\+?[0-9]{10,15}$/)
      .messages({
        "string.empty": "Phone number is required.",
        "string.pattern.base": "Phone number must be a valid phone number.",
      }),
    is_active: Joi.boolean().optional(),
  }),

  // Schema untuk params get staff
  params: Joi.object({
    get_all: Joi.boolean().optional().default(true),

    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    }).when("get_all", {
      is: false,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),

    order_by: Joi.array()
      .items(
        Joi.object({
          field: Joi.string().valid("name", "phone_number", "is_active", "created_at", "updated_at").required(),
          direction: Joi.string().valid("asc", "desc").default("asc"),
        })
      )
      .optional(),

    include_relation: Joi.array().items(Joi.string().valid("Staff_log", "Order")).optional(),

    search: Joi.string().min(1).max(100).optional(),

    advSearch: Joi.object({
      with_total_shift_minutes: Joi.boolean().truthy("true").falsy("false").default(false).optional(),
      shift_month: Joi.date().format("YYYY-MM").optional(),
    }).optional(),

    filter: Joi.object({
      is_active: Joi.boolean().truthy("true").falsy("false").optional(),

      created_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
      updated_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),

      created_range: Joi.object({
        start: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
        end: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
      }).when("created_at", {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.optional(),
      }),

      updated_range: Joi.object({
        start: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
        end: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
      }).when("updated_at", {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.optional(),
      }),
    }).optional(),
  }),
};

export default staffSchema;
