import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const baseFields = {
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().precision(2).min(0).required(),
    description: Joi.string().allow("").max(255),
    category: Joi.string().required(),
    image_uri: Joi.string().required(),
    is_active: Joi.boolean().default(true),
};

const productSchema = {
    // Schema saat create
    create: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        price: Joi.number().precision(2).min(0).required(),
        description: Joi.string().allow("").max(255),
        category: Joi.string().required(),
        image_uri: Joi.string().required(),
        is_active: Joi.boolean().default(true),
    }),

    // Schema saat update
    update: Joi.object({
        name: baseFields.name.optional(),
        price: baseFields.price.optional(),
        description: baseFields.description.optional(),
        category: baseFields.category.optional(),
        image_uri: baseFields.image_uri.optional(),
        is_active: baseFields.is_active.optional(),
    }),

    params: Joi.object({
        get_all: Joi.boolean().optional().default(false),

        pagination: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
        }).when('get_all', {
            is: false,
            then: Joi.forbidden(),
            otherwise: Joi.optional(),
        }),

        order_by: Joi.array().items(
            Joi.object({
                field: Joi.string().valid(
                    'name',
                    'price',
                    'description',
                    'category',
                    'is_active',
                    'created_at',
                    'updated_at'
                ).required(),
                direction: Joi.string().valid('asc', 'desc').default('asc'),
            })
        ).optional(),

        include_relation: Joi.array().items(
            Joi.string().valid(
                'Order_item',
                'Add_on_group',
                'Product_config',
                'Product_discount'
            )
        ).optional(),

        search: Joi.string().min(1).max(100).optional(),

        filter: Joi.object({
            is_active: Joi.boolean().truthy('true').falsy('false').optional(),
            category: Joi.string().optional(),

            price_range: Joi.object({
                min: Joi.number().precision(2).min(0).optional(),
                max: Joi.number().precision(2).min(0).optional(),
            }).when('price', {
                is: Joi.exist(),
                then: Joi.forbidden(),
                otherwise: Joi.optional(),
            }),

            price: Joi.number().precision(2).min(0).optional(),

            created_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
            updated_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),

            created_range: Joi.object({
                start: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
                end: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
            }).when('created_at', {
                is: Joi.exist(),
                then: Joi.forbidden(),
                otherwise: Joi.optional(),
            }),

            updated_range: Joi.object({
                start: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
                end: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
            }).when('updated_at', {
                is: Joi.exist(),
                then: Joi.forbidden(),
                otherwise: Joi.optional(),
            }),
        }).optional()
    })
};

export default productSchema;
