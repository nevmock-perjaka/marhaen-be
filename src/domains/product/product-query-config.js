const productQueryConfig = {
  searchableFields: ["name", "description", "category"],
  filterableFields: ["is_active", "category", "price"],
  hasSoftDelete: true,
  relations: {
    Add_on_group: {
      include: {
        Add_on: {
          include: {
            Add_on_config: {
              include: { inventory: true },
            },
          },
        },
      },
    },
    Product_config: {
      include: {
        inventory: true,
      },
    },
    Order_item: true,
    Product_discount: true,
  },
};

export default productQueryConfig;
