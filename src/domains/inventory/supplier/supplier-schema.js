import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const supplierSchema = {
  // Schema untuk create supplier
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().allow("").optional(),
    address: Joi.string().required(),
    phone_number: Joi.string()
      .pattern(/^[0-9+\-\s]{7,15}$/)
      .required(),
    status: Joi.boolean().default(true),
    price: Joi.number().precision(2).min(0).required(),
    unit_type: Joi.string().required(),
  }),

  // Schema untuk update supplier
  update: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().allow("").optional(),
    address: Joi.string().optional(),
    phone_number: Joi.string()
      .pattern(/^[0-9+\-\s]{7,15}$/)
      .optional(),
    status: Joi.boolean().optional(),
    price: Joi.number().precision(2).min(0).optional(),
    unit_type: Joi.string().optional(),
  }),

  // Schema untuk params get supplier
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
          field: Joi.string()
            .valid("name", "description", "address", "phone_number", "status", "price", "unit_type", "created_at")
            .required(),
          direction: Joi.string().valid("asc", "desc").default("asc"),
        })
      )
      .optional(),

    include_relation: Joi.array().items(Joi.string().valid("Input_history")).optional(),

    search: Joi.string().min(1).max(100).optional(),

    filter: Joi.object({
      status: Joi.boolean().truthy("true").falsy("false").optional(),
      unit_type: Joi.string().optional(),

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

export default supplierSchema;
