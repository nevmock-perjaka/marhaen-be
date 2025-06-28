const addonGroupQueryConfig = {
  searchableFields: ["name", "product.name"],
  filterableFields: ["is_required", "is_active"],
  hasSoftDelete: false,
  relations: {
    Add_on: {
      include: {
        Add_on_config: {
          include: {
            inventory: true,
          },
        },
      },
    },
    product: true,
  },
};

export default addonGroupQueryConfig;
