import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from 'bcryptjs';

async function main() {
    // ─────────────────────────────────────────────
    // CONSTANTS
    // ─────────────────────────────────────────────
    const seedTimestamp   = new Date('2025-06-16T06:58:42.904Z');
    const ownerUserId     = '7eeeb9fc-6a5f-41a5-984a-f51835340729';   // ← user_id yang diminta
    const ownerProfileId  = 'profile-owner-warteg-001';               // profile OWNER

    // ─────────────────────────────────────────────
    // 1. SITE CONFIG
    // ─────────────────────────────────────────────
    await prisma.site_config.upsert({
        where:  { id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6' },
        update: {},
        create: {
            id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
            ppn_percentage: 12,
        },
    });
    console.log('✅ Site Config seeded.');

    // ─────────────────────────────────────────────
    // 2. PLAN
    // ─────────────────────────────────────────────
    await prisma.plan.upsert({
        where:  { id: '9760a8fb-97d5-4980-8d23-a2be19c72c18' },
        update: {},
        create: {
            id:          '9760a8fb-97d5-4980-8d23-a2be19c72c18',
            name:        'Essential',
            days:        365,
            price:       1500000,
            level:       1,
            is_active:   false,
            created_at:  seedTimestamp,
            updated_at:  seedTimestamp,
        },
    });
    console.log('✅ Plan seeded.');

    // ─────────────────────────────────────────────
    // 3. USER + PROFILES
    // ─────────────────────────────────────────────
    await prisma.user.upsert({
        where:  { id: ownerUserId },
        update: {},
        create: {
            id:             ownerUserId,
            name:           'Faiz',
            email:          'faizelfahad2@gmail.com',
            phone_number:   '082334326639',
            password:       await bcrypt.hash('Prj977je94.', await bcrypt.genSalt(10)),
            is_banned:      false,
            subs_expired_at: null,
            subs_level:     0,
            tax_percentage: 0,
            verified_at:    seedTimestamp,
            created_at:     seedTimestamp,
            updated_at:     seedTimestamp,
            profiles: {
                create: [
                    {
                        id:         ownerProfileId,
                        role:       'OWNER',
                        pin:        null,
                        created_at: seedTimestamp,
                        updated_at: seedTimestamp,
                    },
                    {
                        id:         'profile-staff-warteg-001',
                        role:       'STAFF',
                        pin:        null,
                        created_at: seedTimestamp,
                        updated_at: seedTimestamp,
                    },
                    {
                        id:         'profile-cashier-warteg-001',
                        role:       'CASHIER',
                        pin:        null,
                        created_at: seedTimestamp,
                        updated_at: seedTimestamp,
                    },
                ],
            },
        },
    });
    console.log('✅ User and profiles seeded.');

    // ─────────────────────────────────────────────
    // 4. STAFF
    // ─────────────────────────────────────────────
    await prisma.staff.upsert({
        where:  { id: 'staff-warteg-budi-001' },
        update: {},
        create: {
            id:           'staff-warteg-budi-001',
            name:         'Budi Santoso',
            phone_number: '081298765432',
            is_active:    true,
            created_at:   seedTimestamp,
            updated_at:   seedTimestamp,
            created_by:   ownerProfileId,
            updated_by:   ownerProfileId,
            owned_by:     ownerUserId,
            Staff_log: {
                create: [
                    {
                        id:              'stafflog-warteg-001',
                        start_timestamp: new Date('2025-06-16T07:00:00.000Z'),
                        end_timestamp:   null,
                        created_at:      seedTimestamp,
                        updated_at:      seedTimestamp,
                        created_by:      ownerProfileId,
                        updated_by:      ownerProfileId,
                        owned_by:        ownerUserId,
                    },
                ],
            },
        },
    });
    console.log('✅ Staff seeded.');

    // ─────────────────────────────────────────────
    // 5. TABLES
    // ─────────────────────────────────────────────
    const wartegTables = [
        { id: 'table-warteg-01', identifier_table: 'T01', table_name: 'Meja 1', min_capacity: 2, max_capacity: 4, is_outdoor: false, barcode: 'WTG-T01' },
        { id: 'table-warteg-02', identifier_table: 'T02', table_name: 'Meja 2', min_capacity: 2, max_capacity: 4, is_outdoor: false, barcode: 'WTG-T02' },
        { id: 'table-warteg-03', identifier_table: 'T03', table_name: 'Meja 3', min_capacity: 4, max_capacity: 6, is_outdoor: false, barcode: 'WTG-T03' },
        { id: 'table-warteg-04', identifier_table: 'T04', table_name: 'Meja Luar', min_capacity: 2, max_capacity: 4, is_outdoor: true, barcode: 'WTG-T04' },
    ];

    await prisma.table.createMany({
        data: wartegTables.map((t) => ({
            ...t,
            table_desc:  `Meja makan sederhana warteg kapasitas ${t.min_capacity}–${t.max_capacity} orang.`,
            image_uri:   null,
            is_active:   true,
            created_at:  seedTimestamp,
            updated_at:  seedTimestamp,
            created_by:  ownerProfileId,
            updated_by:  ownerProfileId,
            owned_by:    ownerUserId,
        })),
        skipDuplicates: true,
    });
    console.log('✅ Tables seeded.');

    // ─────────────────────────────────────────────
    // 6. SUPPLIERS  (7 supplier untuk bahan warteg)
    // ─────────────────────────────────────────────
    const wartegSuppliers = [
        {
            id:           'supplier-beras-nusantara',
            name:         'Beras Nusantara',
            description:  'Supplier beras dan minyak goreng untuk kebutuhan dapur warteg.',
            address:      'Jl. Pasar Induk No. 12, Jakarta Timur',
            phone_number: '081200010001',
            status:       true,
            price:        32000,
            unit_type:    'kg',
        },
        {
            id:           'supplier-protein-segar',
            name:         'Protein Segar',
            description:  'Supplier ayam potong, telur, lele, dan lauk protein segar harian.',
            address:      'Jl. Peternakan Raya No. 8, Bogor',
            phone_number: '081200010002',
            status:       true,
            price:        36000,
            unit_type:    'kg',
        },
        {
            id:           'supplier-tempe-tahu-jaya',
            name:         'Tempe Tahu Jaya',
            description:  'Supplier tempe dan tahu segar untuk menu harian warteg.',
            address:      'Jl. Industri UMKM No. 21, Bandung',
            phone_number: '081200010003',
            status:       true,
            price:        5000,
            unit_type:    'pcs',
        },
        {
            id:           'supplier-sayur-pagi-segar',
            name:         'Sayur Pagi Segar',
            description:  'Supplier sayuran pasar tradisional: kangkung, bayam, kol, wortel.',
            address:      'Jl. Pasar Pagi No. 3, Semarang',
            phone_number: '081200010004',
            status:       true,
            price:        8000,
            unit_type:    'ikat',
        },
        {
            id:           'supplier-bumbu-pasar-indah',
            name:         'Bumbu Pasar Indah',
            description:  'Supplier bawang merah, bawang putih, cabai rawit, dan santan kelapa.',
            address:      'Jl. Pasar Indah No. 7, Yogyakarta',
            phone_number: '081200010005',
            status:       true,
            price:        15000,
            unit_type:    'kg',
        },
        {
            id:           'supplier-laut-segar-nusantara',
            name:         'Laut Segar Nusantara',
            description:  'Supplier ikan tongkol dan hasil laut segar untuk lauk warteg.',
            address:      'Jl. Pelabuhan Timur No. 14, Cirebon',
            phone_number: '081200010006',
            status:       true,
            price:        28000,
            unit_type:    'kg',
        },
        {
            id:           'supplier-daging-harapan',
            name:         'Daging Harapan',
            description:  'Supplier daging sapi dan jeroan (ati ampela) segar berkualitas.',
            address:      'Jl. Sentra Kuliner No. 19, Surabaya',
            phone_number: '081200010007',
            status:       true,
            price:        125000,
            unit_type:    'kg',
        },
    ];

    await prisma.supplier.createMany({
        data: wartegSuppliers.map((s) => ({
            ...s,
            created_at: seedTimestamp,
            updated_at: seedTimestamp,
            created_by: ownerProfileId,
            updated_by: ownerProfileId,
            owned_by:   ownerUserId,
        })),
        skipDuplicates: true,
    });
    console.log('✅ Suppliers seeded.');

    // ─────────────────────────────────────────────
    // 7. INVENTORY + INPUT_HISTORY  (18 bahan baku)
    // ─────────────────────────────────────────────
    const wartegIngredients = [
        // ── BAHAN POKOK ──────────────────────────
        {
            id: 'inventory-beras', product_name: 'Beras',
            description: 'Beras medium untuk nasi putih dan nasi goreng.',
            category: 'Bahan Pokok', unit_type: 'kg',
            supplier_id: 'supplier-beras-nusantara',
            shipping_fee: 25000, price: 3200000, total_stock: 200, current_stock: 200,
            input_id: 'input-beras',
        },
        {
            id: 'inventory-minyak-goreng', product_name: 'Minyak Goreng',
            description: 'Minyak goreng untuk semua menu gorengan dan nasi goreng.',
            category: 'Bahan Pokok', unit_type: 'liter',
            supplier_id: 'supplier-beras-nusantara',
            shipping_fee: 18000, price: 155000, total_stock: 100, current_stock: 100,
            input_id: 'input-minyak-goreng',
        },
        {
            id: 'inventory-mie-kuning', product_name: 'Mie Kuning',
            description: 'Mie kuning basah untuk mie goreng warteg.',
            category: 'Bahan Pokok', unit_type: 'bungkus',
            supplier_id: 'supplier-beras-nusantara',
            shipping_fee: 12000, price: 120000, total_stock: 80, current_stock: 80,
            input_id: 'input-mie-kuning',
        },

        // ── PROTEIN ──────────────────────────────
        {
            id: 'inventory-ayam', product_name: 'Ayam Potong',
            description: 'Ayam potong segar untuk ayam goreng, bakar, dan soto.',
            category: 'Protein', unit_type: 'kg',
            supplier_id: 'supplier-protein-segar',
            shipping_fee: 30000, price: 4200000, total_stock: 120, current_stock: 120,
            input_id: 'input-ayam',
        },
        {
            id: 'inventory-telur', product_name: 'Telur Ayam',
            description: 'Telur ayam untuk telur dadar, balado, dan campuran nasi goreng.',
            category: 'Protein', unit_type: 'butir',
            supplier_id: 'supplier-protein-segar',
            shipping_fee: 20000, price: 560000, total_stock: 2000, current_stock: 2000,
            input_id: 'input-telur',
        },
        {
            id: 'inventory-lele', product_name: 'Ikan Lele',
            description: 'Ikan lele segar untuk lele goreng.',
            category: 'Protein', unit_type: 'ekor',
            supplier_id: 'supplier-protein-segar',
            shipping_fee: 25000, price: 540000, total_stock: 120, current_stock: 120,
            input_id: 'input-lele',
        },
        {
            id: 'inventory-ati-ampela', product_name: 'Ati Ampela',
            description: 'Ati ampela ayam untuk sambal goreng ati.',
            category: 'Protein', unit_type: 'kg',
            supplier_id: 'supplier-protein-segar',
            shipping_fee: 22000, price: 320000, total_stock: 50, current_stock: 50,
            input_id: 'input-ati-ampela',
        },
        {
            id: 'inventory-daging-sapi', product_name: 'Daging Sapi',
            description: 'Daging sapi untuk menu premium warteg.',
            category: 'Protein', unit_type: 'kg',
            supplier_id: 'supplier-daging-harapan',
            shipping_fee: 35000, price: 1450000, total_stock: 60, current_stock: 60,
            input_id: 'input-daging-sapi',
        },

        // ── PROTEIN NABATI ────────────────────────
        {
            id: 'inventory-tempe', product_name: 'Tempe',
            description: 'Tempe segar untuk gorengan dan sayur lodeh.',
            category: 'Protein Nabati', unit_type: 'papan',
            supplier_id: 'supplier-tempe-tahu-jaya',
            shipping_fee: 12000, price: 180000, total_stock: 100, current_stock: 100,
            input_id: 'input-tempe',
        },
        {
            id: 'inventory-tahu', product_name: 'Tahu',
            description: 'Tahu putih untuk gorengan dan lauk harian.',
            category: 'Protein Nabati', unit_type: 'pcs',
            supplier_id: 'supplier-tempe-tahu-jaya',
            shipping_fee: 12000, price: 150000, total_stock: 200, current_stock: 200,
            input_id: 'input-tahu',
        },

        // ── PROTEIN LAUT ──────────────────────────
        {
            id: 'inventory-tongkol', product_name: 'Ikan Tongkol',
            description: 'Tongkol segar untuk lauk balado dan oseng.',
            category: 'Protein Laut', unit_type: 'kg',
            supplier_id: 'supplier-laut-segar-nusantara',
            shipping_fee: 28000, price: 680000, total_stock: 80, current_stock: 80,
            input_id: 'input-tongkol',
        },

        // ── SAYURAN ───────────────────────────────
        {
            id: 'inventory-kangkung', product_name: 'Kangkung',
            description: 'Kangkung untuk tumis dan pelengkap menu.',
            category: 'Sayuran', unit_type: 'ikat',
            supplier_id: 'supplier-sayur-pagi-segar',
            shipping_fee: 10000, price: 75000, total_stock: 100, current_stock: 100,
            input_id: 'input-kangkung',
        },
        {
            id: 'inventory-bayam', product_name: 'Bayam',
            description: 'Bayam segar untuk sayur bening dan capcay.',
            category: 'Sayuran', unit_type: 'ikat',
            supplier_id: 'supplier-sayur-pagi-segar',
            shipping_fee: 10000, price: 70000, total_stock: 100, current_stock: 100,
            input_id: 'input-bayam',
        },
        {
            id: 'inventory-kol', product_name: 'Kol',
            description: 'Kol segar untuk sayur lodeh, sop, dan capcay.',
            category: 'Sayuran', unit_type: 'kg',
            supplier_id: 'supplier-sayur-pagi-segar',
            shipping_fee: 12000, price: 90000, total_stock: 80, current_stock: 80,
            input_id: 'input-kol',
        },
        {
            id: 'inventory-wortel', product_name: 'Wortel',
            description: 'Wortel untuk sayur lodeh, sop, dan capcay.',
            category: 'Sayuran', unit_type: 'kg',
            supplier_id: 'supplier-sayur-pagi-segar',
            shipping_fee: 12000, price: 110000, total_stock: 80, current_stock: 80,
            input_id: 'input-wortel',
        },
        {
            id: 'inventory-kentang', product_name: 'Kentang',
            description: 'Kentang untuk perkedel.',
            category: 'Sayuran', unit_type: 'kg',
            supplier_id: 'supplier-sayur-pagi-segar',
            shipping_fee: 12000, price: 90000, total_stock: 60, current_stock: 60,
            input_id: 'input-kentang',
        },
        {
            id: 'inventory-tauge', product_name: 'Tauge',
            description: 'Tauge segar untuk cah tauge dan pelengkap.',
            category: 'Sayuran', unit_type: 'ikat',
            supplier_id: 'supplier-sayur-pagi-segar',
            shipping_fee: 10000, price: 65000, total_stock: 80, current_stock: 80,
            input_id: 'input-tauge',
        },

        // ── BUMBU ─────────────────────────────────
        {
            id: 'inventory-bawang-merah', product_name: 'Bawang Merah',
            description: 'Bawang merah untuk bumbu dasar warteg.',
            category: 'Bumbu', unit_type: 'kg',
            supplier_id: 'supplier-bumbu-pasar-indah',
            shipping_fee: 14000, price: 145000, total_stock: 50, current_stock: 50,
            input_id: 'input-bawang-merah',
        },
        {
            id: 'inventory-bawang-putih', product_name: 'Bawang Putih',
            description: 'Bawang putih untuk tumisan dan lauk goreng.',
            category: 'Bumbu', unit_type: 'kg',
            supplier_id: 'supplier-bumbu-pasar-indah',
            shipping_fee: 14000, price: 130000, total_stock: 50, current_stock: 50,
            input_id: 'input-bawang-putih',
        },
        {
            id: 'inventory-cabai-rawit', product_name: 'Cabai Rawit',
            description: 'Cabai rawit untuk sambal, balado, dan tumisan pedas.',
            category: 'Bumbu', unit_type: 'kg',
            supplier_id: 'supplier-bumbu-pasar-indah',
            shipping_fee: 14000, price: 170000, total_stock: 40, current_stock: 40,
            input_id: 'input-cabai-rawit',
        },
        {
            id: 'inventory-santan', product_name: 'Santan',
            description: 'Santan kelapa untuk sayur lodeh dan rendang.',
            category: 'Bumbu', unit_type: 'liter',
            supplier_id: 'supplier-bumbu-pasar-indah',
            shipping_fee: 14000, price: 90000, total_stock: 40, current_stock: 40,
            input_id: 'input-santan',
        },
    ];

    await prisma.inventory.createMany({
        data: wartegIngredients.map(({ supplier_id, shipping_fee, price, total_stock, current_stock, input_id, ...inv }) => ({
            ...inv,
            created_at: seedTimestamp,
            updated_at: seedTimestamp,
            created_by: ownerProfileId,
            updated_by: ownerProfileId,
            owned_by:   ownerUserId,
        })),
        skipDuplicates: true,
    });

    await prisma.input_history.createMany({
        data: wartegIngredients.map((ing) => ({
            id:            ing.input_id,
            supplier_id:   ing.supplier_id,
            inventory_id:  ing.id,
            shipping_fee:  ing.shipping_fee,
            price:         ing.price,
            total_stock:   ing.total_stock,
            current_stock: ing.current_stock,
            input_datetime: seedTimestamp,
            created_at:    seedTimestamp,
            updated_at:    seedTimestamp,
            created_by:    ownerProfileId,
            updated_by:    ownerProfileId,
            owned_by:      ownerUserId,
        })),
        skipDuplicates: true,
    });

    console.log('✅ Inventory dan Input History seeded.');

    // ─────────────────────────────────────────────
    // 8. PRODUCTS (20 menu warteg realistis)
    //    + PRODUCT_CONFIG (ingredient mapping)
    // ─────────────────────────────────────────────
    const wartegMenus = [
        // ── NASI / KARBOHIDRAT ────────────────────────────────────────
        {
            id: 'product-nasi-putih',
            name: 'Nasi Putih',
            description: 'Nasi putih pulen sebagai menu utama dan pendamping semua lauk.',
            price: 5000,
            category: 'Nasi',
            image_uri: 'https://example.com/images/warteg/nasi-putih.jpg',
            ingredients: [
                { inventory_id: 'inventory-beras', value: 1 },
            ],
        },
        {
            id: 'product-nasi-goreng-warteg',
            name: 'Nasi Goreng Warteg',
            description: 'Nasi goreng sederhana dengan telur dan cabai, khas dapur warteg.',
            price: 14000,
            category: 'Nasi',
            image_uri: 'https://example.com/images/warteg/nasi-goreng.jpg',
            ingredients: [
                { inventory_id: 'inventory-beras',        value: 1 },
                { inventory_id: 'inventory-telur',        value: 1 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },
        {
            id: 'product-mie-goreng',
            name: 'Mie Goreng',
            description: 'Mie goreng dengan telur dan bumbu bawang.',
            price: 13000,
            category: 'Mie',
            image_uri: 'https://example.com/images/warteg/mie-goreng.jpg',
            ingredients: [
                { inventory_id: 'inventory-mie-kuning',   value: 1 },
                { inventory_id: 'inventory-telur',        value: 1 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },

        // ── LAUK AYAM ─────────────────────────────────────────────────
        {
            id: 'product-ayam-goreng',
            name: 'Ayam Goreng',
            description: 'Ayam goreng bumbu kuning yang gurih dan renyah.',
            price: 18000,
            category: 'Lauk Ayam',
            image_uri: 'https://example.com/images/warteg/ayam-goreng.jpg',
            ingredients: [
                { inventory_id: 'inventory-ayam',         value: 1 },
                { inventory_id: 'inventory-bawang-putih', value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 2 },
            ],
        },
        {
            id: 'product-ayam-bakar',
            name: 'Ayam Bakar',
            description: 'Ayam bakar manis pedas khas warteg.',
            price: 20000,
            category: 'Lauk Ayam',
            image_uri: 'https://example.com/images/warteg/ayam-bakar.jpg',
            ingredients: [
                { inventory_id: 'inventory-ayam',         value: 1 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-bawang-putih', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 1 },
            ],
        },
        {
            id: 'product-soto-ayam',
            name: 'Soto Ayam',
            description: 'Soto ayam hangat berkuah bening gurih.',
            price: 15000,
            category: 'Lauk Ayam',
            image_uri: 'https://example.com/images/warteg/soto-ayam.jpg',
            ingredients: [
                { inventory_id: 'inventory-ayam',         value: 1 },
                { inventory_id: 'inventory-kol',          value: 1 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-bawang-putih', value: 1 },
            ],
        },

        // ── LAUK TELUR ────────────────────────────────────────────────
        {
            id: 'product-telur-balado',
            name: 'Telur Balado',
            description: 'Telur rebus digoreng dengan sambal balado pedas manis.',
            price: 12000,
            category: 'Lauk Telur',
            image_uri: 'https://example.com/images/warteg/telur-balado.jpg',
            ingredients: [
                { inventory_id: 'inventory-telur',        value: 2 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 2 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },
        {
            id: 'product-telur-dadar',
            name: 'Telur Dadar',
            description: 'Telur dadar tebal dan gurih untuk lauk simpel sehari-hari.',
            price: 10000,
            category: 'Lauk Telur',
            image_uri: 'https://example.com/images/warteg/telur-dadar.jpg',
            ingredients: [
                { inventory_id: 'inventory-telur',        value: 2 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },

        // ── LAUK IKAN / LAUT ──────────────────────────────────────────
        {
            id: 'product-lele-goreng',
            name: 'Lele Goreng',
            description: 'Lele goreng renyah dengan sambal lalapan, menu favorit warteg.',
            price: 16000,
            category: 'Lauk Ikan',
            image_uri: 'https://example.com/images/warteg/lele-goreng.jpg',
            ingredients: [
                { inventory_id: 'inventory-lele',         value: 2 },
                { inventory_id: 'inventory-bawang-putih', value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 2 },
            ],
        },
        {
            id: 'product-tongkol-balado',
            name: 'Tongkol Balado',
            description: 'Ikan tongkol dimasak bumbu balado pedas dan gurih.',
            price: 15000,
            category: 'Lauk Ikan',
            image_uri: 'https://example.com/images/warteg/tongkol-balado.jpg',
            ingredients: [
                { inventory_id: 'inventory-tongkol',      value: 1 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 2 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },

        // ── LAUK DAGING / JEROAN ──────────────────────────────────────
        {
            id: 'product-daging-sapi-lada-hitam',
            name: 'Daging Sapi Lada Hitam',
            description: 'Daging sapi tumis dengan bumbu lada hitam, menu spesial warteg.',
            price: 35000,
            category: 'Lauk Daging',
            image_uri: 'https://example.com/images/warteg/daging-sapi-lada-hitam.jpg',
            ingredients: [
                { inventory_id: 'inventory-daging-sapi',  value: 1 },
                { inventory_id: 'inventory-bawang-putih', value: 1 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },
        {
            id: 'product-sambal-goreng-ati',
            name: 'Sambal Goreng Ati',
            description: 'Ati ampela dimasak bumbu sambal goreng pedas dan gurih.',
            price: 15000,
            category: 'Lauk Daging',
            image_uri: 'https://example.com/images/warteg/sambal-goreng-ati.jpg',
            ingredients: [
                { inventory_id: 'inventory-ati-ampela',   value: 1 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 2 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },

        // ── LAUK TEMPE / TAHU ─────────────────────────────────────────
        {
            id: 'product-tempe-goreng',
            name: 'Tempe Goreng',
            description: 'Tempe goreng hangat, lauk sederhana andalan warteg.',
            price: 7000,
            category: 'Lauk Nabati',
            image_uri: 'https://example.com/images/warteg/tempe-goreng.jpg',
            ingredients: [
                { inventory_id: 'inventory-tempe',        value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },
        {
            id: 'product-tahu-goreng',
            name: 'Tahu Goreng',
            description: 'Tahu goreng renyah untuk lauk sehari-hari.',
            price: 7000,
            category: 'Lauk Nabati',
            image_uri: 'https://example.com/images/warteg/tahu-goreng.jpg',
            ingredients: [
                { inventory_id: 'inventory-tahu',         value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },
        {
            id: 'product-tempe-orek',
            name: 'Tempe Orek',
            description: 'Tempe orek manis pedas kering, cocok sebagai lauk tahan lama.',
            price: 10000,
            category: 'Lauk Nabati',
            image_uri: 'https://example.com/images/warteg/tempe-orek.jpg',
            ingredients: [
                { inventory_id: 'inventory-tempe',        value: 1 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },

        // ── SAYUR ─────────────────────────────────────────────────────
        {
            id: 'product-oseng-kangkung',
            name: 'Oseng Kangkung',
            description: 'Tumis kangkung dengan cabai dan bawang, segar dan gurih.',
            price: 10000,
            category: 'Sayur',
            image_uri: 'https://example.com/images/warteg/oseng-kangkung.jpg',
            ingredients: [
                { inventory_id: 'inventory-kangkung',     value: 1 },
                { inventory_id: 'inventory-bawang-putih', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },
        {
            id: 'product-sayur-lodeh',
            name: 'Sayur Lodeh',
            description: 'Sayur lodeh gurih berkuah santan dengan aneka sayuran segar.',
            price: 10000,
            category: 'Sayur',
            image_uri: 'https://example.com/images/warteg/sayur-lodeh.jpg',
            ingredients: [
                { inventory_id: 'inventory-santan',       value: 1 },
                { inventory_id: 'inventory-kol',          value: 1 },
                { inventory_id: 'inventory-wortel',       value: 1 },
                { inventory_id: 'inventory-tempe',        value: 1 },
            ],
        },
        {
            id: 'product-sop-sayur',
            name: 'Sop Sayur',
            description: 'Sop sayur bening dengan wortel, kol, dan bayam.',
            price: 10000,
            category: 'Sayur',
            image_uri: 'https://example.com/images/warteg/sop-sayur.jpg',
            ingredients: [
                { inventory_id: 'inventory-kol',          value: 1 },
                { inventory_id: 'inventory-wortel',       value: 1 },
                { inventory_id: 'inventory-bayam',        value: 1 },
                { inventory_id: 'inventory-bawang-merah', value: 1 },
            ],
        },
        {
            id: 'product-capcay-sayur',
            name: 'Capcay Sayur',
            description: 'Capcay sayur dengan kol, wortel, bayam, dan bumbu bawang.',
            price: 12000,
            category: 'Sayur',
            image_uri: 'https://example.com/images/warteg/capcay-sayur.jpg',
            ingredients: [
                { inventory_id: 'inventory-kol',          value: 1 },
                { inventory_id: 'inventory-wortel',       value: 1 },
                { inventory_id: 'inventory-bayam',        value: 1 },
                { inventory_id: 'inventory-bawang-putih', value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },
        {
            id: 'product-cah-tauge',
            name: 'Cah Tauge',
            description: 'Tauge tumis sederhana untuk lauk sayur cepat saji.',
            price: 8000,
            category: 'Sayur',
            image_uri: 'https://example.com/images/warteg/cah-tauge.jpg',
            ingredients: [
                { inventory_id: 'inventory-tauge',        value: 1 },
                { inventory_id: 'inventory-bawang-putih', value: 1 },
                { inventory_id: 'inventory-cabai-rawit',  value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },

        // ── GORENGAN ──────────────────────────────────────────────────
        {
            id: 'product-perkedel-kentang',
            name: 'Perkedel Kentang',
            description: 'Perkedel kentang lembut dengan bumbu daun bawang, lauk favorit.',
            price: 8000,
            category: 'Gorengan',
            image_uri: 'https://example.com/images/warteg/perkedel-kentang.jpg',
            ingredients: [
                { inventory_id: 'inventory-kentang',      value: 2 },
                { inventory_id: 'inventory-telur',        value: 1 },
                { inventory_id: 'inventory-bawang-putih', value: 1 },
                { inventory_id: 'inventory-minyak-goreng',value: 1 },
            ],
        },
    ];

    await prisma.product.createMany({
        data: wartegMenus.map(({ ingredients, ...product }) => ({
            ...product,
            is_active:  true,
            created_at: seedTimestamp,
            updated_at: seedTimestamp,
            created_by: ownerProfileId,
            updated_by: ownerProfileId,
            owned_by:   ownerUserId,
        })),
        skipDuplicates: true,
    });

    await prisma.product_config.createMany({
        data: wartegMenus.flatMap((menu) =>
            menu.ingredients.map((ingredient) => ({
                id:           `config-${menu.id}-${ingredient.inventory_id}`,
                product_id:   menu.id,
                inventory_id: ingredient.inventory_id,
                operation:    'reduce',
                value:        ingredient.value,
                created_at:   seedTimestamp,
                updated_at:   seedTimestamp,
                created_by:   ownerProfileId,
                updated_by:   ownerProfileId,
                owned_by:     ownerUserId,
            }))
        ),
        skipDuplicates: true,
    });

    console.log('✅ 20 menu warteg, product_config (ingredient mapping) seeded.');

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
