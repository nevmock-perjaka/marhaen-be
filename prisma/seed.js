import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from 'bcryptjs';

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
            password: await bcrypt.hash("Prj977je94.", await bcrypt.genSalt(10)),
            is_banned: false,
            subs_expired_at: null,
            subs_level: 0,
            tax_percentage: 0,
            verified_at: new Date('2025-06-16T06:58:42.902Z'),
            created_at: new Date('2025-06-16T06:58:42.904Z'),
            updated_at: new Date('2025-06-16T06:58:42.904Z'),
            profiles: {
                create: [
                    {
                        id: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
                        role: 'OWNER',
                        pin: null,
                        created_at: new Date('2025-06-16T06:58:42.904Z'),
                        updated_at: new Date('2025-06-16T06:58:42.904Z'),
                    },
                    {
                        id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
                        role: 'STAFF',
                        pin: null,
                        created_at: new Date('2025-06-16T06:58:42.904Z'),
                        updated_at: new Date('2025-06-16T06:58:42.904Z'),
                    },
                    {
                        id: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
                        role: 'CASHIER',
                        pin: null,
                        created_at: new Date('2025-06-16T06:58:42.904Z'),
                        updated_at: new Date('2025-06-16T06:58:42.904Z'),
                    },
                ],
            },
        },
    });
    
    console.log('✅ User and profiles seeded.');
    
    await prisma.supplier.create({
        data: {
            id: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
            name: 'Coffee Supplier',
            description: 'Supplier of high-quality coffee beans.',
            phone_number: '081234567890',
            address: '123 Coffee Street, Java City',
            status: true,   
            created_at: new Date('2025-06-16T06:58:42.904Z'),
            updated_at: new Date('2025-06-16T06:58:42.904Z'),
            created_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
            updated_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
            owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
        }
    })

    console.log('✅ Supplier seeded.');
    
    await prisma.inventory.create({
        data: {
            id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
            product_name: 'd1e2f3a4-b5c6-7d8e-9f0a-b1c2d3e4f5a6',
            description: 'Coffee beans for brewing.',
            unit_type: 'kg',
            category: 'Beverages',
            created_at: new Date('2025-06-16T06:58:42.904Z'),
            updated_at: new Date('2025-06-16T06:58:42.904Z'),
            created_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
            updated_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
            owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
            Input_history: {
                create: [
                    {
                        id: 'g1h2i3j4-k5l6-7m8n-9o0p-q1r2s3t4u5v6',
                        supplier_id: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Supplier ID
                        shipping_fee: 10000,
                        price: 200000,
                        total_stock: 50,
                        current_stock: 50,
                        input_datetime: new Date('2025-06-16T07:00:00.000Z'),
                        created_at: new Date('2025-06-16T06:58:42.904Z'),
                        updated_at: new Date('2025-06-16T06:58:42.904Z'),
                        created_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                        updated_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                        owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
                    },
                    {
                        id: 'w1x2y3z4-a5b6-c7d8-e9f0-g1h2i3j4k5l6',
                        supplier_id: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Supplier ID
                        shipping_fee: 15000,
                        price: 250000,
                        total_stock: 30,
                        current_stock: 30,
                        input_datetime: new Date('2025-06-16T08:00:00.000Z'),
                        created_at: new Date('2025-06-16T06:58:42.904Z'),
                        updated_at: new Date('2025-06-16T06:58:42.904Z'),
                        created_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                        updated_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                        owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
                    },
                ]
            }
        }
    });

    console.log('✅ Inventory and Input history seeded.');

    await prisma.product.create({
        data: {
            id: 'd1e2f3a4-b5c6-7d8e-9f0a-b1c2d3e4f5a6',
            name: 'Coffee',
            description: 'A delicious cup of coffee.',
            price: 25000,
            is_active: true,
            image_uri: 'https://example.com/images/coffee.jpg',
            category: 'Beverages',
            created_at: new Date('2025-06-16T06:58:42.904Z'),
            updated_at: new Date('2025-06-16T06:58:42.904Z'),
            created_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
            updated_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
            owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
            Add_on_group: {
                create: [
                    {
                        id: 'g1h2i3j4-k5l6-7m8n-9o0p-q1r2s3t4u5v6',
                        name: 'Milk Options',
                        is_required: false,
                        max_selection: 2,
                        is_active: true,
                        created_at: new Date('2025-06-16T06:58:42.904Z'),
                        updated_at: new Date('2025-06-16T06:58:42.904Z'),
                        created_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                        updated_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                        owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
                        Add_on: {
                            create: [
                                {
                                    id: 'w1x2y3z4-a5b6-c7d8-e9f0-g1h2i3j4k5l6',
                                    name: 'Whole Milk',
                                    price: 5000,
                                    is_active: true,
                                    created_at: new Date('2025-06-16T06:58:42.904Z'),
                                    updated_at: new Date('2025-06-16T06:58:42.904Z'),
                                    created_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                                    updated_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                                    owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
                                    Add_on_config: {
                                        create: {
                                            id: 'x1y2z3a4-b5c6-d7e8-f9g0-h1i2j3k4l5m6',
                                            inventory_id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Inventory ID
                                            operation: 'reduce',
                                            value: 1,
                                            created_at: new Date('2025-06-16T06:58:42.904Z'),
                                            updated_at: new Date('2025-06-16T06:58:42.904Z'),
                                            created_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                                            updated_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                                            owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
                                        }
                                    }
                                },
                                {
                                    id: 'm1n2o3p4-q5r6-s7t8-u9v0-w1x2y3z4a5b6',
                                    name: 'Almond Milk',
                                    price: 7000,
                                    is_active: true,
                                    created_at: new Date('2025-06-16T06:58:42.904Z'),
                                    updated_at: new Date('2025-06-16T06:58:42.904Z'),
                                    created_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                                    updated_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                                    owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
                                    Add_on_config: {
                                        create: {
                                            id: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
                                            inventory_id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Inventory ID
                                            operation: 'reduce',
                                            value: 1,
                                            created_at: new Date('2025-06-16T06:58:42.904Z'),
                                            updated_at: new Date('2025-06-16T06:58:42.904Z'),
                                            created_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                                            updated_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                                            owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
                                        }
                                    }
                                },
                            ],
                        },
                    },
                ],
            },
            Product_config: {
                create: {
                    id: 'h1i2j3k4-l5m6-n7o8-p9q0-r1s2t3u4v5w6',
                    inventory_id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Inventory ID
                    operation: 'reduce',
                    value: 2,
                    created_at: new Date('2025-06-16T06:58:42.904Z'),
                    updated_at: new Date('2025-06-16T06:58:42.904Z'),
                    created_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                    updated_by: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', // Owner profile ID
                    owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
                }
            }
        },
    })

    console.log('✅ Product and Add-on groups seeded.');

    await prisma.staff.create({
        data: {
            id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
            name: 'John Doe',
            phone_number: '081234567890',
            is_active: true,
            created_at: new Date('2025-06-16T06:58:42.904Z'),
            updated_at: new Date('2025-06-16T06:58:42.904Z'),
            created_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
            updated_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
            owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
            Staff_log: {
                create: [
                    {
                        id: 'f1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6',
                        start_timestamp: new Date('2025-06-16T07:00:00.000Z'),
                        end_timestamp: null, // Clocked in
                        created_at: new Date('2025-06-16T06:58:42.904Z'),
                        updated_at: new Date('2025-06-16T06:58:42.904Z'),
                        created_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                        updated_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                        owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
                    },
                ],
            },
        }
    })
    
    console.log('✅ Staff and Staff logs seeded.');




    await prisma.table.createMany({
        data: [
            {
                id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
                min_capacity: 2,
                max_capacity: 4,
                image_uri: 'https://example.com/images/table1.jpg',
                identifier_table: 'T001',
                table_name: 'Table 1',
                table_desc: 'A cozy table for small gatherings.',
                is_outdoor: false,
                is_active: true,
                barcode: '1234567890123',
                created_at: new Date('2025-06-16T06:58:42.904Z'),
                updated_at: new Date('2025-06-16T06:58:42.904Z'),
                created_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                updated_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
            },
            {
                id: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
                min_capacity: 4,
                max_capacity: 6,
                image_uri: 'https://example.com/images/table2.jpg',
                identifier_table: 'T002',
                table_name: 'Table 2',
                table_desc: 'A spacious table for larger groups.',
                is_outdoor: true,
                is_active: true,
                barcode: '1234567890124',
                created_at: new Date('2025-06-16T06:58:42.904Z'),
                updated_at: new Date('2025-06-16T06:58:42.904Z'),
                created_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                updated_by: 'b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6', // Owner profile ID
                owned_by: 'ff2f2d52-b315-4068-99a1-a559cac7723d',
            }
        ]
    })

    console.log('✅ Tables seeded.');

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
