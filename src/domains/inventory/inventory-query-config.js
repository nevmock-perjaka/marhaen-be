const inventoryQueryConfig = {
	searchableFields: ["product_name"],
	filterableFields: ["unit_type", "category", "description"],
	hasSoftDelete: false,
	relations: {
		Product_config: true,
		Add_on_config: true,
		Input_history: true,
	},
};

export default inventoryQueryConfig;
