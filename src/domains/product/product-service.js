import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";
import { readFileSync, unlinkSync } from "fs";
import * as XLSX from "xlsx";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import productQueryConfig from "./product-query-config.js";

class ProductService {
    // async findAll(userId, query = {}) {
    async findAll(userId) {
        // const options = buildQueryOptions(productQueryConfig, query, userId);
        // return await db.product.findMany(options);
        return await db.product.findMany({
            where: {
                owned_by: userId
            },
            include: {
                Add_on_group: {
                    include: {
                        Add_on: {
                            include: {
                                Add_on_config: {
                                    include: {
                                        inventory: true
                                    }
                                }
                            }
                        }
                    }
                },
                Product_config: {
                    include: {
                        inventory: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });
    }

    async findById(id, userId) {
        const product = await db.product.findUnique({
            where: { id },
            include: {
                Add_on_group: {
                    include: {
                        Add_on: {
                            include: {
                                Add_on_config: {
                                    include: {
                                        inventory: true
                                    }
                                }
                            }
                        }
                    }
                },
                Product_config: {
                    include: {
                        inventory: true
                    }
                }
            }
        });

        if (!product) throw BaseError.notFound("Product not found.");

        if (product.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this product.");
        
        return product;
    }

    async create(data) {
        return await db.product.create({ data });
    }

    async update(id, data) {
        await this.checkPermission(id, data.owned_by)

        return await db.product.update({
            where: { id },
            data
        });
    }

    async softDelete(id, userId) {
        await this.checkPermission(id, userId);
        return await db.product.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
    }

    async delete(id, userId) {
        await this.checkPermission(id, userId);

        return await db.product.delete({
            where: { id }
        });
    }

    async checkPermission(id, userId) {
        const product = await db.product.findUnique({
            where: { id },
        });

        if (!product) throw BaseError.notFound("Product not found.");
        if (product.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this product.");
    }

    async import(filePath, userId, profileId) {
        const fileBuffer = readFileSync(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const products = XLSX.utils.sheet_to_json(sheet);

        const createdProducts = [];

        let status = {
            success: 0,
            failed: 0,
            skipped: 0,
            total: products.length,
        }

        for (const item of products) {
            const { name, price, description, category, image_uri } = item;

            if (!name || !price || !category || !image_uri || !description) {
                console.warn("Skipping invalid row:", item);
                status.skipped++;
                continue;
            }

            // Simpan ke DB
            try {
                const product = await db.product.create({
                    data: {
                        name,
                        price: Number(price),
                        description,
                        category,
                        image_uri: "/public/product/" + image_uri,
                        is_active: true,
                        created_by: profileId,
                        updated_by: profileId,
                        owned_by: userId,
                    },
                });
                status.success++;
                createdProducts.push(product);
            } catch (error) {
                console.error("Error creating product:", error);
                status.failed++;
                continue;
            }
        }
        // Hapus file setelah import
        try {
            unlinkSync(filePath);
        } catch (error) {
            console.error("Error deleting file:", error);
        }

        return status;
    }
}

export default new ProductService();
