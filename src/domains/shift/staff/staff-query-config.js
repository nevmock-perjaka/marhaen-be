const staffQueryConfig = {
  searchableFields: ["name", "phone_number"],
  filterableFields: ["is_active"],
  hasSoftDelete: false,
  relations: {
    Staff_log: true,
    Order: true,
  },
};

export default staffQueryConfig;
