import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";

class ProductService {
    async findAll(userId) {
        return await db.product.findMany({
            where: { 
                owned_by: userId,
            },
            include: {
                Add_on_group: true,
                Product_config: true
            }
        });
    }

    async findById(id, userId) {
        const product = await db.product.findUnique({
            where: { id },
            include: {
                Add_on_group: true,
                Product_config: true
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
}

export default new ProductService();
