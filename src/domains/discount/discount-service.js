import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";
import Joi from "joi";
import discountQueryConfig from "./discount-query-config.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";

class DiscountService {
  async findAll(userId, query) {
    const options = buildQueryOptions(discountQueryConfig, query, userId);

    const [data, count] = await Promise.all([
      db.discount.findMany(options),
      db.discount.count({
        where: options.where,
      }),
    ]);

    const currentPage = query?.pagination?.page ?? 1;
    const itemsPerPage = query?.pagination?.limit ?? 10;
    const totalPages = Math.ceil(count / itemsPerPage);

    return {
      data,
      meta:
        query?.pagination?.page && query?.pagination?.limit
          ? {
              totalItems: count,
              totalPages,
              currentPage,
              itemsPerPage,
            }
          : null,
      count: data.length,
    };
  }

  async findById(id, userId) {
    const discount = await db.discount.findUnique({
      where: { id },
      include: {
        Product_discount: true,
        Order: true,
      },
    });

    if (!discount) {
      throw BaseError.notFound("Discount not found.");
    }

    if (discount.owned_by !== userId) {
      throw BaseError.forbidden("You are not allowed to access this discount.");
    }

    return discount;
  }

  async create(data) {
    const existShareableCode = await db.discount.findFirst({
      where: {
        shareable_code: data.shareable_code,
        owned_by: data.owned_by,
      },
    });

    if (existShareableCode) throw BaseError.badRequest("Shareable code already exists.");

    return await db.discount.create({ data });
  }

  async update(id, data) {
    await this.checkPermission(id, data.owned_by);

    const existsDiscount = await this.findById(id, data.owned_by);

    if (data.expired_at && new Date(existsDiscount.start_at) >= data.expired_at.getTime()) {
      let validation = "";
      let stack = [];

      validation += "Expired date must be greater than start date.";

      stack.push({
        message: "Expired date must be greater than start date.",
        path: ["expired_at"],
      });

      throw new Joi.ValidationError(validation, stack);
    }

    return await db.discount.update({
      where: { id },
      data,
    });
  }

  async delete(id, userId) {
    await this.checkPermission(id, userId);

    return await db.discount.delete({
      where: { id },
    });
  }

  async checkPermission(id, userId) {
    const discount = await db.discount.findUnique({
      where: { id },
    });

    if (!discount) {
      throw BaseError.notFound("Discount not found.");
    }

    if (discount.owned_by !== userId) {
      throw BaseError.forbidden("You are not allowed to access this discount.");
    }
  }
}

export default new DiscountService();
