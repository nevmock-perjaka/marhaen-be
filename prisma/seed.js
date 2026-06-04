import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function main() {
    // ─────────────────────────────────────────────
    // CONSTANTS
    // ─────────────────────────────────────────────
    const seedTimestamp   = new Date();
    const ownerUserId     = '0e69746b-4323-46c1-8962-2bd39413125f';   
    const ownerProfileId  = 'profile-owner-warteg-001';

    // Generated UUIDs (proper UUID v4)
    const supplierIds = [
        'e0228b85-db72-4e2d-ad2a-08bc45a3688b',
        '4ca79d06-6e33-4c2e-9409-7a860bad3f85',
        '20b92d19-b434-42b9-9cfb-26bd9123476b',
        'a0727bd3-6c8b-4eb6-9a4c-90ffa2462269',
        '4a7844a7-37eb-473a-9e1c-dc6aab8ed336',
        'f3655102-fc82-41cf-aa4c-e9e7f7ab5bb5',
        '5283b129-b7b9-4afb-8b35-b18dd0c49b8c',
    ];

    const inventoryIds = [
        '6002d704-616a-47ee-89b6-31bfee038bcf',
        '51e86ac2-32ff-45c7-acef-9ce0c886246b',
        '031c65d2-90f7-4d74-8a98-923c82e43c66',
        '759a8773-e236-47d8-9238-2cb542cfbb8f',
        '7f187122-d773-4a95-bc5a-a8fce81f9856',
        '92ad6ce5-1e6d-4e85-985e-e4f51ed008d8',
        '0c381348-d787-43aa-955b-9aed4da74082',
        'a04ec933-970a-4b3f-9f46-d3d144479ae2',
        '55ff5f03-c083-4e53-8150-b4cb7e2cef0e',
        '898a4763-db05-455b-88de-e42ae8b25e81',
        'e91bc15b-9806-41c5-8ad3-a2db0a52e510',
        '52cabbe8-e319-49e5-99a8-fa6244962ec5',
        '3bf11e44-4281-493b-800f-7f07dce1e99b',
        '57dedb5e-561e-464c-8489-d0218f6dc195',
        '8577579d-5122-456b-9367-0326c1b3e713',
    ];

    const inputHistoryIds = [
        'cb6eeddf-367e-410b-af38-8b2c87fcb8fd',
        '6a74e6d5-5325-4504-9192-73b58cf60526',
        '7f3e8b7e-980c-47bc-be8f-2fa1743caeca',
        '63ff514f-db7d-415b-b52b-72c5004fb07e',
        'b54db26e-dd47-452d-9113-8558c6b06941',
        '9785b274-4963-45e7-b7e4-b4c896a16571',
        '3300a30b-5a8e-42d6-bfb1-d747dc7ee7ed',
        'c9441423-6b5a-404f-9bb0-b0dc8b41c4cb',
        '95a6385f-ce87-4fcf-8e93-1ce0453cba89',
        'ea49c806-8cc3-416f-806d-9c00c7e60336',
        '9e912fe2-d265-4745-911b-7000f13a6360',
        'c12d80f1-52ec-4a1b-9766-d73d0e8958de',
        '6b2db065-4afd-4401-983c-0cc35ea1160e',
        'be8480fc-f7de-466e-aced-3a4d95ecb2eb',
        '532d3910-b6fe-47c6-82a3-a0b4e78f7ab7',
    ];

    const productIds = [
        'c9f9f31e-4865-4646-a2c7-12bb7b452212',
        'd63c863b-9877-4c58-a71b-0ae39623db65',
        '289edce3-fd0d-4d56-934f-0144594e3ea6',
        'cbec0ce5-3a74-427f-9a63-f6f0ca8e4e0b',
        '61c7ca75-518f-4a26-8dcd-1acbc8fa212b',
        '020f7848-877a-4ff6-b6a7-b1e5c8c3127b',
        'deedeee6-2b36-40b1-9383-f5a1851031fc',
        'ce425ac0-cc84-4c87-8241-3d7de3e3a162',
        '448b67ae-7fef-4402-a0f6-82fe71bf5705',
        'cba171d5-c779-4987-b847-ce6ee4a17c69',
        'e293136d-14af-4af1-867a-f9d3f5f60676',
        '107d89bc-a4c5-4ca0-a222-eb97e9c1698f',
        'dadd1f67-6b62-4457-ad9d-936dad7b9331',
        'bfdd0340-cde7-4cb1-ab85-191393463d57',
        'd5196705-5f41-46f0-84ab-e0a2274dfcbc',
    ];

    const productConfigIds = [
        '34db2275-de93-40a7-a6cb-b73e20593e05',
        '6c23437d-eeae-431e-847e-fefc5776305d',
        'c188dc30-5993-4264-aa40-63fa70439277',
        '40ec688b-af67-4c39-b4f9-4294ee90ee81',
        '4e9b3baf-46a2-4f42-b75e-c177a5565b1e',
        '5f4e06fb-6832-4879-8485-d33c5a86e7b7',
        '22911ad0-e9ee-417a-9362-fba4fe5c81d1',
        '48bbbe7c-e18f-43f9-bc71-ef1de7683761',
        'b2f84ed6-cf4a-4d0f-a54e-34fee890b816',
        '2c42e154-176f-4fbf-a647-5c1e7874c8e2',
        '21103271-67a1-4e4c-ae21-403a83228ade',
        'bbbacf63-41c7-484b-a7ae-55d9032a5219',
        'eccb5b20-2dce-402d-bd96-fceeb63b2a5c',
        '91dddd72-15cf-4c24-9d3d-355b992febee',
        '1f61a75a-2426-44b4-b2f9-5876e8b6161d',
        'b00524c2-48a5-440f-b0a4-ce2f7be276f6',
        'c92b48b7-5847-4c50-89dc-06b165fdb0ec',
        '97846459-241e-41cd-b456-84014358b261',
        'ccf76d9e-367d-49eb-8377-42680f90fe9b',
        '28bf91d7-4fcc-43cf-b060-ef9d4e2035df',
        '3f09f80f-6e16-4f25-acdc-b9fdc7249913',
        'e34a5d78-56f6-4037-b871-7680ce76478c',
        '87ae692f-f207-48df-abeb-e10118115beb',
        '0f7bf4ad-388b-4a2a-bfcf-eac92e66b434',
        'e3d749ef-fc43-40bb-8488-eabfb7383b0d',
        '1a0de084-9c27-4ff9-95f6-28dd48fa9528',
        'cc3f3e87-fe95-401a-a7cf-695b2e902458',
        'a8c2a60b-f2a0-4926-9621-d25e5b781f2d',
        '11c596da-629f-4961-9855-1fa255da1445',
        'd89d485e-f369-4448-b433-a4b72383fc0b',
    ];

    // ─────────────────────────────────────────────
    // 1. SITE CONFIG
    // ─────────────────────────────────────────────
    await prisma.site_config.upsert({
        where:  { id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6' },
        update: {},
        create: {
            id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
            ppn_percentage: 11,
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
            is_active:   true,
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
            name:           'Toko Nazila',
            email:          'azrianr77@gmail.com',
            phone_number:   '082334326639',
            password:       await bcrypt.hash('Prj977je94.', await bcrypt.genSalt(10)),
            is_banned:      false,
            subs_expired_at: null,
            subs_level:     0,
            tax_percentage: 0,
            verified_at:    seedTimestamp,
            strict_mode:    false,
            created_at:     seedTimestamp,
            updated_at:     seedTimestamp,
            profiles: {
                create: [
                    { id: ownerProfileId, role: 'OWNER', pin: null },
                    { id: 'profile-staff-001', role: 'STAFF', pin: null },
                    { id: 'profile-cashier-001', role: 'CASHIER', pin: null },
                ],
            },
        },
    });
    console.log('✅ User and profiles seeded.');

    // ─────────────────────────────────────────────
    // 4. STAFF
    // ─────────────────────────────────────────────
    const staffBudiId = uuidv4();
    const staffLogId = uuidv4();
    
    await prisma.staff.upsert({
        where:  { id: staffBudiId },
        update: {},
        create: {
            id:           staffBudiId,
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
                        id:              staffLogId,
                        start_timestamp: seedTimestamp,
                        created_by:      ownerProfileId,
                        updated_by:      ownerProfileId,
                        owned_by:        ownerUserId,
                    },
                ],
            },
        },
    });
    console.log(`✅ Staff seeded with ID: ${staffBudiId}`);

    // ─────────────────────────────────────────────
    // 5. TABLES
    // ─────────────────────────────────────────────
    const wartegTables = [
        { id: 'table-01', identifier_table: 'T01', table_name: 'Meja Dalam 1', min_capacity: 2, max_capacity: 4, is_outdoor: false, barcode: 'WTG-01' },
        { id: 'table-02', identifier_table: 'T02', table_name: 'Meja Dalam 2', min_capacity: 2, max_capacity: 4, is_outdoor: false, barcode: 'WTG-02' },
        { id: 'table-03', identifier_table: 'T03', table_name: 'Meja Luar', min_capacity: 4, max_capacity: 6, is_outdoor: true, barcode: 'WTG-03' },
    ];

    await prisma.table.createMany({
        data: wartegTables.map((t) => ({
            ...t,
            table_desc:  `Meja kapasitas ${t.min_capacity} - ${t.max_capacity}`,
            image_uri:   "",
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
    // 6. SUPPLIERS (UUIDs + Realistis)
    // ─────────────────────────────────────────────
    const suppliers = [
        {
            id: supplierIds[0],
            name: 'Kios Ayam Pasar Dayeuhkolot',
            description: 'Ayam potong segar, premium grade untuk restoran',
            address: 'Blok C-12, Pasar Dayeuhkolot, Jl. Padjajaran',
            phone_number: '08111111111',
            status: true,
        },
        {
            id: supplierIds[1],
            name: 'Agen Ikan Segar Sumedang',
            description: 'Ikan mas, nila, tongkol pindang berkualitas',
            address: 'Jl. Jenderal Sudirman, Sumedang (20km dari Dayeuhkolot)',
            phone_number: '08222222222',
            status: true,
        },
        {
            id: supplierIds[2],
            name: 'Grosir Telur Bojongsoang',
            description: 'Telur ayam ras fresh, harga grosir',
            address: 'Jl. Raya Bojongsoang No. 45, Kab. Bandung',
            phone_number: '08333333333',
            status: true,
        },
        {
            id: supplierIds[3],
            name: 'Pabrik Tahu & Tempe Ciganitri',
            description: 'Tahu putih, kuning, tempe hidup dari pabrik',
            address: 'Jl. Ciganitri Km 5, Bojongsoang, Bandung',
            phone_number: '08444444444',
            status: true,
        },
        {
            id: supplierIds[4],
            name: 'Lapak Sayur Pasar Kaget Bojong',
            description: 'Sayur mayur: terong, toge, kentang, bawang, cabai segar',
            address: 'Pasar Kaget Jl. Raya Bojongsoang, buka pagi-siang',
            phone_number: '08555555555',
            status: true,
        },
        {
            id: supplierIds[5],
            name: 'Distributor Sembako Bandung Pusat',
            description: 'Mie instan, nugget, sosis, beras, minyak, bumbu siap pakai',
            address: 'Jl. Bengawan No. 78, Bandung (25km)',
            phone_number: '08666666666',
            status: true,
        },
        {
            id: supplierIds[6],
            name: 'Pasar Induk Caringin - Bumbu & Rempah',
            description: 'Cabai, bawang, garam, gula, kecap, saus lengkap',
            address: 'Jl. Caringin, Bandung',
            phone_number: '08777777777',
            status: true,
        },
    ];

    await prisma.supplier.createMany({
        data: suppliers.map(s => ({
            ...s,
            price: null,
            unit_type: null,
            created_at: seedTimestamp, updated_at: seedTimestamp, created_by: ownerProfileId, updated_by: ownerProfileId, owned_by: ownerUserId,
        })), skipDuplicates: true,
    });
    console.log('✅ Suppliers seeded (7 suppliers with proper UUIDs).');

    // ─────────────────────────────────────────────
    // 7. INVENTORY (UUIDs + Unit Logis)
    // ─────────────────────────────────────────────
    const inventories = [
        { id: inventoryIds[0], product_name: 'Ayam Potong', category: 'Lauk Mentah', unit_type: 'potong', description: 'Ayam potong sedang (1 potong ≈ 150-200g), modal Rp3.5k/potong' },
        { id: inventoryIds[1], product_name: 'Ikan Mas Segar', category: 'Lauk Mentah', unit_type: 'ekor', description: 'Ikan mas/nila medium (1 ekor ≈ 300-400g), modal Rp4.2k/ekor' },
        { id: inventoryIds[2], product_name: 'Ikan Tongkol Pindang', category: 'Lauk Mentah', unit_type: 'potong', description: 'Tongkol keranjang siap olah, modal Rp2k/potong' },
        { id: inventoryIds[3], product_name: 'Telur Ayam Ras', category: 'Lauk Mentah', unit_type: 'butir', description: 'Telur ayam ras (1 butir ≈ 55g), modal Rp1.75k/butir' },
        { id: inventoryIds[4], product_name: 'Tahu Kuning Segar', category: 'Lauk Mentah', unit_type: 'pcs', description: 'Tahu kuning siap goreng (1 pcs ≈ 100g), modal Rp600/pcs' },
        { id: inventoryIds[5], product_name: 'Tempe Potong', category: 'Lauk Mentah', unit_type: 'potong', description: 'Tempe siap goreng (1 potong = 60g), modal Rp500/potong' },
        { id: inventoryIds[6], product_name: 'Usus Siap Olah', category: 'Lauk Mentah', unit_type: 'porsi', description: 'Usus siap goreng porsian, modal Rp2k/porsi' },
        { id: inventoryIds[7], product_name: 'Nugget Ayam Curah', category: 'Lauk Mentah', unit_type: 'pcs', description: 'Nugget frozen (1 pcs ≈ 25-30g), modal Rp700/pcs' },
        { id: inventoryIds[8], product_name: 'Sosis Sapi/Ayam', category: 'Lauk Mentah', unit_type: 'pcs', description: 'Sosis merah (1 pcs ≈ 40g), modal Rp2.5k/pcs' },
        { id: inventoryIds[9], product_name: 'Terong Segar Porsian', category: 'Sayur Mentah', unit_type: 'porsi', description: 'Terong dipotong siap balado (1 porsi ≈ 100g), modal Rp800/porsi' },
        { id: inventoryIds[10], product_name: 'Toge Segar Porsian', category: 'Sayur Mentah', unit_type: 'porsi', description: 'Toge segar dicuci siap oseng (1 porsi ≈ 80g), modal Rp600/porsi' },
        { id: inventoryIds[11], product_name: 'Kentang Potong Porsian', category: 'Sayur Mentah', unit_type: 'porsi', description: 'Kentang potong siap goreng (1 porsi ≈ 100g), modal Rp800/porsi' },
        { id: inventoryIds[12], product_name: 'Mie Telur Porsian', category: 'Karbohidrat', unit_type: 'porsi', description: 'Mie telur porsi siap masak (1 porsi ≈ 80g), modal Rp1k/porsi' },
        { id: inventoryIds[13], product_name: 'Bumbu & Minyak (Base)', category: 'Bumbu', unit_type: 'porsi', description: 'Estimasi cost bumbu dasar: cabai, bawang, garam, minyak per piring, modal Rp1.5k/porsi' },
    ];

    await prisma.inventory.createMany({
        data: inventories.map((inv) => ({
            ...inv,
            created_at: seedTimestamp, updated_at: seedTimestamp, created_by: ownerProfileId, updated_by: ownerProfileId, owned_by: ownerUserId,
        })), skipDuplicates: true,
    });
    console.log('✅ Inventory seeded (14 raw materials with proper UUIDs).');

    // ─────────────────────────────────────────────
    // 8. INPUT HISTORY (UUIDs + Pembelian Bahan)
    // ─────────────────────────────────────────────
    const inputHistories = [
        { id: inputHistoryIds[0], supplier_id: supplierIds[0], inventory_id: inventoryIds[0], shipping_fee: 5000, price: 350000, total_stock: 100, current_stock: 100 },
        { id: inputHistoryIds[1], supplier_id: supplierIds[1], inventory_id: inventoryIds[1], shipping_fee: 10000, price: 210000, total_stock: 50, current_stock: 50 },
        { id: inputHistoryIds[2], supplier_id: supplierIds[1], inventory_id: inventoryIds[2], shipping_fee: 5000, price: 100000, total_stock: 50, current_stock: 50 },
        { id: inputHistoryIds[3], supplier_id: supplierIds[2], inventory_id: inventoryIds[3], shipping_fee: 5000, price: 262500, total_stock: 150, current_stock: 150 },
        { id: inputHistoryIds[4], supplier_id: supplierIds[3], inventory_id: inventoryIds[4], shipping_fee: 0, price: 60000, total_stock: 100, current_stock: 100 },
        { id: inputHistoryIds[5], supplier_id: supplierIds[3], inventory_id: inventoryIds[5], shipping_fee: 0, price: 50000, total_stock: 100, current_stock: 100 },
        { id: inputHistoryIds[6], supplier_id: supplierIds[0], inventory_id: inventoryIds[6], shipping_fee: 5000, price: 100000, total_stock: 50, current_stock: 50 },
        { id: inputHistoryIds[7], supplier_id: supplierIds[5], inventory_id: inventoryIds[7], shipping_fee: 5000, price: 70000, total_stock: 100, current_stock: 100 },
        { id: inputHistoryIds[8], supplier_id: supplierIds[0], inventory_id: inventoryIds[8], shipping_fee: 5000, price: 125000, total_stock: 50, current_stock: 50 },
        { id: inputHistoryIds[9], supplier_id: supplierIds[4], inventory_id: inventoryIds[9], shipping_fee: 2000, price: 80000, total_stock: 100, current_stock: 100 },
        { id: inputHistoryIds[10], supplier_id: supplierIds[4], inventory_id: inventoryIds[10], shipping_fee: 2000, price: 60000, total_stock: 100, current_stock: 100 },
        { id: inputHistoryIds[11], supplier_id: supplierIds[4], inventory_id: inventoryIds[11], shipping_fee: 3000, price: 80000, total_stock: 100, current_stock: 100 },
        { id: inputHistoryIds[12], supplier_id: supplierIds[5], inventory_id: inventoryIds[12], shipping_fee: 5000, price: 80000, total_stock: 80, current_stock: 80 },
        { id: inputHistoryIds[13], supplier_id: supplierIds[6], inventory_id: inventoryIds[13], shipping_fee: 10000, price: 750000, total_stock: 500, current_stock: 500 },
    ];

    await prisma.input_history.createMany({
        data: inputHistories.map((inp) => ({
            ...inp,
            input_datetime: seedTimestamp,
            created_at: seedTimestamp, updated_at: seedTimestamp, created_by: ownerProfileId, updated_by: ownerProfileId, owned_by: ownerUserId,
        })), skipDuplicates: true,
    });
    console.log('✅ Input History seeded (14 dengan proper UUIDs).');

    // ─────────────────────────────────────────────
    // 9. PRODUCTS & PRODUCT_CONFIG (UUIDs)
    // ─────────────────────────────────────────────
    const menus = [
        // LAUK AYAM
        { productId: productIds[0], name: 'Ayam Cabe', price: 9000, category: 'Lauk Ayam', description: 'Ayam potong goreng bumbu cabe kering, pedas nikmat', ingredients: [inventoryIds[0], inventoryIds[13]] },
        { productId: productIds[1], name: 'Ayam Padang', price: 9000, category: 'Lauk Ayam', description: 'Ayam goreng bumbu rempah khas Padang', ingredients: [inventoryIds[0], inventoryIds[13]] },
        { productId: productIds[2], name: 'Ayam Bumbu Hitam', price: 9000, category: 'Lauk Ayam', description: 'Ayam potong goreng dengan bumbu hitam menggunakan kecap manis', ingredients: [inventoryIds[0], inventoryIds[13]] },

        // LAUK IKAN
        { productId: productIds[3], name: 'Ikan', price: 7000, category: 'Lauk Ikan', description: 'Ikan mas/nila segar goreng dengan bumbu tradisional', ingredients: [inventoryIds[1], inventoryIds[13]] },
        { productId: productIds[4], name: 'Tongkol sambal merah', price: 5000, category: 'Lauk Ikan', description: 'Tongkol pindang dengan sambal merah cabai fresh', ingredients: [inventoryIds[2], inventoryIds[13]] },

        // LAUK TELUR
        { productId: productIds[5], name: 'Telur Balado', price: 5000, category: 'Lauk Telur', description: 'Telur rebus balado dengan cabai, pedas gurih', ingredients: [inventoryIds[3], inventoryIds[13]] },
        { productId: productIds[6], name: 'Telur Dadar', price: 5000, category: 'Lauk Telur', description: 'Telur dadar gurih dengan bawang dan tomat', ingredients: [inventoryIds[3], inventoryIds[13]] },

        // LAUK NABATI
        { productId: productIds[7], name: 'Tahu', price: 3000, category: 'Lauk Nabati', description: 'Tahu kuning goreng dengan sambal kecap', ingredients: [inventoryIds[4], inventoryIds[13]] },
        { productId: productIds[8], name: 'Tempe', price: 3000, category: 'Lauk Nabati', description: 'Tempe goreng crispy dengan sambal matah atau kecap', ingredients: [inventoryIds[5], inventoryIds[13]] },

        // SAYUR
        { productId: productIds[9], name: 'Terong Balado', price: 2000, category: 'Sayur', description: 'Terong goreng balado, pedas segar', ingredients: [inventoryIds[9], inventoryIds[13]] },
        { productId: productIds[10], name: 'Oseng Toge', price: 3000, category: 'Sayur', description: 'Toge digoreng dengan bawang & cabai, renyah', ingredients: [inventoryIds[10], inventoryIds[13]] },
        { productId: productIds[11], name: 'Sambal goreng kentang', price: 3000, category: 'Sayur', description: 'Kentang potong sambal goreng, gurih pedas', ingredients: [inventoryIds[11], inventoryIds[13]] },

        // LAINNYA
        { productId: productIds[12], name: 'Mie goreng', price: 3000, category: 'Lainnya', description: 'Mie telur goreng dengan telur & sayuran', ingredients: [inventoryIds[12], inventoryIds[13]] },
        { productId: productIds[13], name: 'Nugget (instan)', price: 2000, category: 'Lainnya', description: 'Nugget ayam goreng, renyah hangat', ingredients: [inventoryIds[7], inventoryIds[13]] },
        { productId: productIds[14], name: 'Usus', price: 5000, category: 'Lainnya', description: 'Usus ayam goreng kuning, gurih sedap', ingredients: [inventoryIds[6], inventoryIds[13]] },
        { productId: productIds[14], name: 'Sosis kuah merah', price: 5000, category: 'Lainnya', description: 'Sosis kuah merah pedas, gurih dengan cabai', ingredients: [inventoryIds[8], inventoryIds[13]] },
    ];

    // Insert Products
    await prisma.product.createMany({
        data: menus.map((m) => ({
            id: m.productId,
            name: m.name,
            price: m.price,
            category: m.category,
            description: m.description,
            image_uri: "",
            is_active: true,
            created_at: seedTimestamp, updated_at: seedTimestamp, created_by: ownerProfileId, updated_by: ownerProfileId, owned_by: ownerUserId,
        })), skipDuplicates: true,
    });

    // Insert Product_config
    let configIndex = 0;
    await prisma.product_config.createMany({
        data: menus.flatMap((menu) =>
            menu.ingredients.map((inv_id) => ({
                id: productConfigIds[configIndex++],
                product_id: menu.productId,
                inventory_id: inv_id,
                operation: 'REDUCE',
                value: 1,
                created_at: seedTimestamp, updated_at: seedTimestamp, created_by: ownerProfileId, updated_by: ownerProfileId, owned_by: ownerUserId,
            }))
        ), skipDuplicates: true,
    });

    console.log('✅ 15 Produk menu seeded dengan UUID proper.');
    console.log('🎉 Seeding complete! Toko Nazila siap operasional.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
