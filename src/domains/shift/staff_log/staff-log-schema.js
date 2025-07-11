import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const staffLogSchema = {
  // Schema saat create staff log
  create: Joi.object({
    staff_id: Joi.string().uuid().required(),
    start_timestamp: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
    end_timestamp: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
  }),

  // Schema untuk params get staff log
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
          field: Joi.string().valid("start_timestamp", "end_timestamp", "created_at", "updated_at").required(),
          direction: Joi.string().valid("asc", "desc").default("asc"),
        })
      )
      .optional(),

    include_relation: Joi.array().items(Joi.string().valid("staff")).optional(),

    search: Joi.alternatives().try(Joi.string().min(1).max(100), Joi.number().integer()).optional(),

    advSearch: Joi.object({
      shift_date: Joi.date().format("YYYY-MM-DD").optional(),
    }).optional(),

    filter: Joi.object({
      start_timestamp: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
      end_timestamp: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
      staff_id: Joi.string().optional(),

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

export default staffLogSchema;
