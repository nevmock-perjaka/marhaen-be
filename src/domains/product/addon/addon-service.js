import BaseError from "../../../base_classes/base-error.js";
import db from "../../../config/db.js";

class AddonService {
	async findAll(userId) {
		return await db.add_on.findMany({
			where: {
				owned_by: userId,
			},
			include: {
				add_on_group: true,
				Add_on_config: true,
			},
		});
	}

	async findById(id, userId) {
		const addon = await db.add_on.findUnique({
			where: { id },
			include: {
				add_on_group: true,
				Add_on_config: true,
			},
		});

		if (!addon) throw BaseError.notFound("Add-on not found.");
		if (addon.owned_by !== userId)
			throw BaseError.forbidden("You are not allowed to access this add-on.");

		return addon;
	}

	async create(data) {
		return await db.add_on.create({ data });
	}

	async update(id, data) {
		await this.checkPermission(id, data.owned_by);
		return await db.add_on.update({
			where: { id },
			data,
		});
	}

	async delete(id, userId) {
		await this.checkPermission(id, userId);
		return await db.add_on.delete({
			where: { id },
		});
	}

	async checkPermission(id, userId) {
		const addon = await db.add_on.findUnique({
			where: { id },
		});

		if (!addon) throw BaseError.notFound("Add-on not found.");
		if (addon.owned_by !== userId)
			throw BaseError.forbidden("You are not allowed to access this add-on.");
	}
}

export default new AddonService();
