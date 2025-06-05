import { successResponse } from "../../utils/response.js";
import ProfileService from "./profile-service.js";

class ProfileController {
    async getAll(req, res) {
        const profiles = await ProfileService.findMany();

        return successResponse(res, profiles);
    }


}

export default new ProfileController();