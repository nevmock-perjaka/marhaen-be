export function buildQueryOptions(modelConfig, query = {}, userId) {
    const {
        searchableFields = [],
        filterableFields = [],
        relations = {},
    } = modelConfig;

    const {
        get_all = false,
        pagination,
        order_by,
        include_relation = [],
        search,
        filter = {},
    } = query;

    const where = {
        ...(userId && { owned_by: userId }),
        deleted_at: null,
    };

    // 🔍 Search
    if (search && searchableFields.length) {
        where.OR = searchableFields.map((field) => ({
            [field]: { contains: search, mode: "insensitive" },
        }));
    }

    // 🎯 Filtering
    for (const field of filterableFields) {
        const value = filter[field];
        if (value !== undefined) {
            where[field] = value;
        }
    }

    // 📦 Include Relations
    const include = {};
    for (const rel of include_relation) {
        if (relations[rel]) {
            include[rel] = relations[rel];
        }
    }

    // 📊 Order By
    const orderBy = Array.isArray(order_by)
        ? order_by.map(({ field, direction }) => ({ [field]: direction }))
        : [];

    // 📄 Pagination
    let take, skip;
    if (!get_all && pagination) {
        take = pagination.limit;
        skip = (pagination.page - 1) * pagination.limit;
    }

    return {
        where,
        orderBy,
        include,
        ...(take !== undefined ? { take } : {}),
        ...(skip !== undefined ? { skip } : {}),
    };
}
