const discountQueryConfig = {
  searchableFields: ["shareable_code", "description"],
  filterableFields: ["is_active", "is_percentage", "max_discount", "min_order_amount"],
  hasSoftDelete: false,
  relations: {
    Product_discount: true,
    Order: true,
  },
};

export default discountQueryConfig;
