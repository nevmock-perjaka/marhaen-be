const tableQueryConfig = {
	searchableFields: ["table_name", "identifier_table", "table_desc"],
	filterableFields: ["is_outdoor", "is_active"],
	hasSoftDelete: false,
	relations: {
		Order: true,
	},
};

export default tableQueryConfig;
