import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const tableSchema = {
  // Schema untuk membuat Table baru
  create: Joi.object({
    table_name: Joi.string().min(2).max(50).required(),
    table_desc: Joi.string().min(2).max(100).required(),
    min_capacity: Joi.number().integer().min(1).required(),
    max_capacity: Joi.number().integer().min(Joi.ref("min_capacity")).required(),
    image_uri: Joi.string().optional().allow(null, ""),
    identifier_table: Joi.string().required(),
    is_outdoor: Joi.boolean().default(false),
    is_active: Joi.boolean().default(true),
    barcode: Joi.string().required(),
  }),

  // Schema untuk update Table
  update: Joi.object({
    table_name: Joi.string().min(2).max(50).required(),
    table_desc: Joi.string().min(2).max(100).required(),
    min_capacity: Joi.number().integer().min(1).optional(),
    max_capacity: Joi.number().integer().min(Joi.ref("min_capacity")).optional(),
    image_uri: Joi.string().optional().allow(null, ""),
    identifier_table: Joi.string().optional(),
    is_outdoor: Joi.boolean().optional(),
    is_active: Joi.boolean().optional(),
    barcode: Joi.string().optional(),
  }),

  // Schema untuk params get table
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
            .valid(
              "min_capacity",
              "max_capacity",
              "identifier_table",
              "table_name",
              "is_outdoor",
              "is_active",
              "created_at"
            )
            .required(),
          direction: Joi.string().valid("asc", "desc").default("asc"),
        })
      )
      .optional(),

    include_relation: Joi.array().items(Joi.string().valid("Order")).optional(),

    search: Joi.string().min(1).max(100).optional(),

    filter: Joi.object({
      is_outdoor: Joi.boolean().truthy("true").falsy("false").optional(),
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

export default tableSchema;
