import { successResponse } from "../../utils/response.js";
import ProfileService from "./profile-service.js";

class ProfileController {
    async getAll(req, res) {
        const { user } = req;
        const profiles = await ProfileService.findMany(user.id);

        return successResponse(res, profiles);
    }

    async login(req, res) {
        const { user } = req;
        const { profile_id, pin } = req.body;

        const token = await ProfileService.login(user.id, profile_id, pin);

        return successResponse(res, { access_token: token });
    }

    async getProfile(req, res) {
        const { profile } = req;
        const data = await ProfileService.getProfile(profile.id);

        return successResponse(res, data);
    }

    async updateProfilePin(req, res) {
        const userId = req.user.id;
        const value = req.body;

        const updatedProfile = await ProfileService.updateProfilePin(userId, value);

        return successResponse(res, updatedProfile);
    }

    async resetAccount(req, res) {
        const userId = req.user.id;

        await ProfileService.resetAccount(userId);

        return successResponse(res, { message: "Account reset successfully." });
    }
}

export default new ProfileController();