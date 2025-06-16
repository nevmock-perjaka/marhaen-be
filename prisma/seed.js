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

    console.log('✅ Plan seeded.');
    // 
    // "id": "ff2f2d52-b315-4068-99a1-a559cac7723d",
	// 	"name": "Faiz",
	// 	"email": "tradekuy12@gmail.com",
	// 	"phone_number": "082334326639",
	// 	"is_banned": false,
	// 	"subs_expired_at": null,
	// 	"subs_level": 0,
	// 	"tax_percentage": 0,
	// 	"verified_at": "2025-06-16T06:58:42.902Z",
	// 	"created_at": "2025-06-16T06:58:42.904Z",
	// 	"updated_at": "2025-06-16T06:58:42.904Z"
    await prisma.user.upsert({
        where: { 
            id: 'ff2f2d52-b315-4068-99a1-a559cac7723d' 
        },
        update: {},
        create: {
            id: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
            name: 'Faiz',
            email: 'faizelfahad2@gmail.com',
            phone_number: '082334326639',
            is_banned: false,
            subs_expired_at: null,
            subs_level: 0,
            tax_percentage: 0,
            verified_at: new Date('2025-06-16T06:58:42.902Z'),
            created_at: new Date('2025-06-16T06:58:42.904Z'),
            updated_at: new Date('2025-06-16T06:58:42.904Z'),
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
