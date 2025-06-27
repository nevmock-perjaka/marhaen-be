const orderQueryConfig = {
  searchableFields: ["order_by", "phone_number", "discount.shareable_code"],
  filterableFields: ["order_by", "status", "total_gross", "table_id"],
  hasSoftDelete: false,
  relations: {
    table: true,
    discount: true,
    Order_item: {
      include: {
        product: true,
        Order_item_add_on: {
          include: {
            add_on: true,
          },
        },
      },
    },
    Order_transaction: true,
  },
};

export default orderQueryConfig;
