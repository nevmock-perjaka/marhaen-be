import db from "../../../config/db.js";
import BaseError from "../../../base_classes/base-error.js";
import { buildQueryOptions } from "../../../utils/buildQueryOptions.js";
import addonGroupQueryConfig from "./addonGroup-query-config.js";

class AddonGroupService {
  async findAll(userId, query) {
    const options = buildQueryOptions(addonGroupQueryConfig, query, userId);

    const [data, count] = await Promise.all([
      db.add_on_group.findMany(options),
      db.add_on_group.count({
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
    const group = await db.add_on_group.findUnique({
      where: { id },
      include: {
        Add_on: true,
        product: true,
      },
    });

    if (!group) throw BaseError.notFound("Add-on group not found.");
    if (group.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this add-on group.");

    return group;
  }

  async create(data) {
    return await db.add_on_group.create({
      data,
      include: {
        Add_on: true,
        product: true,
      },
    });
  }

  async update(id, data, updateAddOn, createAddOn) {
    console.log("Data Yang ingin di update:");
    console.log(updateAddOn, createAddOn);
    await this.checkPermission(id, data.owned_by);

    await db.add_on.deleteMany({
      where: {
        owned_by: data.owned_by,
        add_on_group_id: id,
        id: {
          notIn: updateAddOn.map((addon) => addon.id),
        },
      },
    });

    console.log("✅ Add-ons deleted successfully");

    let updatedGroup = await db.add_on_group.update({
      where: { id },
      data,
      include: {
        Add_on: true,
        product: true,
      },
    });

    console.log("✅ Add-on group updated successfully");

    await Promise.all(
      updateAddOn.map(async (addon) => {
        await db.add_on.update({
          where: {
            id: addon.id,
            add_on_group_id: updatedGroup.id,
          },
          data: {
            name: addon.name,
            price: addon.price,
            is_active: addon.is_active,
            updated_by: data.updated_by,
          },
        });
      })
    );

    console.log("✅ Existing add-ons updated successfully");

    await db.add_on.createMany({
      data: createAddOn.map((addon) => ({
        name: addon.name,
        price: addon.price,
        is_active: addon.is_active,
        owned_by: updatedGroup.owned_by,
        created_by: data.updated_by,
        updated_by: data.updated_by,
        add_on_group_id: updatedGroup.id,
      })),
    });

    console.log("✅ New add-ons created successfully");

    updatedGroup = await db.add_on_group.findUnique({
      where: { id },
      include: {
        Add_on: true,
        product: true,
      },
    });

    console.log("✅ Add-on group with updated add-ons retrieved successfully");

    return updatedGroup;
  }

  async delete(id, userId) {
    await this.checkPermission(id, userId);

    return await db.add_on_group.delete({ where: { id } });
  }

  async checkPermission(id, userId) {
    const group = await db.add_on_group.findUnique({
      where: { id },
    });

    if (!group) throw BaseError.notFound("Add-on group not found.");
    if (group.owned_by !== userId) throw BaseError.forbidden("You are not allowed to access this add-on group.");
  }
}

export default new AddonGroupService();
