const supplierQueryConfig = {
	searchableFields: ["name", "description"],
	filterableFields: ["status", "unit_type"],
	hasSoftDelete: false,
	relations: {
		Input_history: true,
	},
};

export default supplierQueryConfig;
