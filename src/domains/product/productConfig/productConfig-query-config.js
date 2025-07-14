const productConfigQueryConfig = {
	searchableFields: ["product.name"],
	filterableFields: ["operation", "product_id", "inventory_id"],
	hasSoftDelete: false,
	relations: {
		product: true,
		inventory: true,
	},
};

export default productConfigQueryConfig;
