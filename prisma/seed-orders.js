import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const ownerUserId = '0e69746b-4323-46c1-8962-2bd39413125f';
const ownerProfileId = 'profile-owner-warteg-001';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatRupiah(amount) {
  return Math.round(amount * 100) / 100;
}

async function main() {
  const staff = await prisma.staff.findFirst({ where: { owned_by: ownerUserId } });
  if (!staff) throw new Error("No staff found for this owner. Run `npm run seed` first.");
  console.log(`Using staff: ${staff.name} (${staff.id})`);

  const products = await prisma.product.findMany({ where: { owned_by: ownerUserId, is_active: true } });
  if (products.length === 0) throw new Error("No products found. Run `npm run seed` first.");
  console.log(`Found ${products.length} products`);

  const today = new Date();
  let totalOrders = 0;
  let totalItems = 0;

  for (let daysAgo = 60; daysAgo >= 0; daysAgo--) {
    const orderDate = new Date(today);
    orderDate.setDate(orderDate.getDate() - daysAgo);

    const ordersCount = randomInt(2, 6);

    for (let o = 0; o < ordersCount; o++) {
      const itemsCount = randomInt(1, 4);
      const selectedProducts = [];
      let orderTotal = 0;

      for (let i = 0; i < itemsCount; i++) {
        const product = products[randomInt(0, products.length - 1)];
        const qty = randomInt(1, 3);
        const price = product.price;
        orderTotal += price * qty;
        selectedProducts.push({ productId: product.id, qty, price });
      }

      const hour = randomInt(8, 21);
      const minute = randomInt(0, 59);
      const createdAt = new Date(orderDate);
      createdAt.setHours(hour, minute, 0, 0);

      const orderId = uuidv4();

      await prisma.order.create({
        data: {
          id: orderId,
          order_by: `Customer ${randomInt(1, 200)}`,
          phone_number: `08${randomInt(100000000, 999999999)}`,
          status: "Paid",
          payment_method: "Manual QRIS",
          total_gross: formatRupiah(orderTotal),
          staff_id: staff.id,
          created_at: createdAt,
          updated_at: createdAt,
          created_by: ownerProfileId,
          updated_by: ownerProfileId,
          owned_by: ownerUserId,
          Order_item: {
            create: selectedProducts.map((sp) => ({
              id: uuidv4(),
              product_id: sp.productId,
              quantity: sp.qty,
              price: sp.price,
              created_at: createdAt,
              updated_at: createdAt,
              created_by: ownerProfileId,
              updated_by: ownerProfileId,
              owned_by: ownerUserId,
            })),
          },
          Order_transaction: {
            create: {
              id: uuidv4(),
              gross_amount: formatRupiah(orderTotal),
              payment_method: "Manual QRIS",
              admin_fee: formatRupiah(orderTotal * 0.02),
              ppn_percentage: 11,
              ppn_fee: formatRupiah(orderTotal * 0.11),
              is_production: false,
              status: "settlement",
              created_at: createdAt,
              updated_at: createdAt,
              created_by: ownerProfileId,
              updated_by: ownerProfileId,
              owned_by: ownerUserId,
            },
          },
        },
      });

      totalOrders++;
      totalItems += itemsCount;
    }
  }

  console.log(`Seeded ${totalOrders} orders with ${totalItems} order items across 61 days.`);
  console.log('🎉 Order seed complete! Restart backend and check chart.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
