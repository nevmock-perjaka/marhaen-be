const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.plan.upsert({
        where: { 
            id: '9760a8fb-97d5-4980-8d23-a2be19c72c18' 
        },
        update: {},
        create: {
            id: '9760a8fb-97d5-4980-8d23-a2be19c72c18',
            name: 'Essential',
            days: 365,
            price: 1500000,
            level: 1,
            is_active: false,
            created_at: new Date('2025-05-12T12:06:18.459Z'),
            updated_at: new Date('2025-05-12T12:06:18.459Z'),
        },
    });

    console.log('✅ Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
