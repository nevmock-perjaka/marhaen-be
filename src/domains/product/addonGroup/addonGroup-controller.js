import { successResponse, createdResponse } from "../../../utils/response.js";
import AddonGroupService from "./addonGroup-service.js";

class AddonGroupController {
    async getAll(req, res) {
        const userId = req.user.id;
        const groups = await AddonGroupService.findAll(userId)

        return successResponse(res, groups);
    }

    async getById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        const group = await AddonGroupService.findById(id, userId);
        return successResponse(res, group);
    }

    async create(req, res) {
        const value = req.body;
        
        value.owned_by = req.user.id;
        value.created_by = req.profile.id;
        value.updated_by = req.profile.id;
        
        value.Add_on = {};
        value.Add_on.createMany = {
            data: value.add_ons.map(addon => {
                addon.owned_by = req.user.id;
                addon.created_by = req.profile.id;
                addon.updated_by = req.profile.id;
                return addon;
            })
        };

        delete value.add_ons; // remove add_ons from value as it is now in Add_on.createMany

        const created = await AddonGroupService.create(value);
        return createdResponse(res, created);
    }

    async update(req, res) {
        const { id } = req.params;
        let value = req.body;

        value.updated_by = req.profile.id;
        value.owned_by = req.user.id;

        const updateAddOn = value.add_ons.filter(addon => addon.id);
        const createAddOn = value.add_ons.filter(addon => !addon.id);

        delete value.add_ons; // remove add_ons from value as it will be handled separately

        const updated = await AddonGroupService.update(id, value, updateAddOn, createAddOn);

        return successResponse(res, updated);
    }

    async delete(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await AddonGroupService.delete(id, userId);

        return successResponse(res, deleted);
    }
}

export default new AddonGroupController();