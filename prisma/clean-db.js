import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const KEEP_USER_ID = '634fbbaf-7f50-47f7-b66c-e1758285cdde';

async function main() {
  // Delete in reverse-dependency order (children first)
  console.log('Cleaning database (keeping user + profiles + plans + site config)...');

  // Order & child tables (cascade handles Order_item, Order_transaction, etc.)
  await prisma.stock_log.deleteMany({});
  await prisma.order_item_add_on.deleteMany({});
  await prisma.order_item.deleteMany({});
  await prisma.order_transaction.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.staff_log.deleteMany({});
  await prisma.staff.deleteMany({});

  // Product & relations
  await prisma.product_config.deleteMany({});
  await prisma.product_discount.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.add_on_config.deleteMany({});
  await prisma.add_on.deleteMany({});
  await prisma.add_on_group.deleteMany({});

  // Inventory & input
  await prisma.input_history.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.supplier.deleteMany({});

  // Misc
  await prisma.discount.deleteMany({});
  await prisma.table.deleteMany({});

  console.log('Done. All data cleared except User, Profile, Site_config, Plan, and Subscription.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
