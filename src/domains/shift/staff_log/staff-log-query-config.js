const staffLogQueryConfig = {
  searchableFields: ["staff.name", "staff.phone_number"],
  filterableFields: ["staff_id", "start_timestamp", "end_timestamp"],
  hasSoftDelete: false,
  relations: {
    staff: true,
  },
};

export default staffLogQueryConfig;
