import { successResponse } from "../../utils/response.js";
import AuthService from "./auth-service.js";

class AuthController {
    async login(req, res) {
        const { email, password } = req.body;

        const token = await AuthService.login(email, password);

        if (!token) {
            throw Error("Failed to login");
        }

        return successResponse(res, token);
    }

    async register(req, res) {
        const { name, email, password, phone_number, otp_verification } = req.body;

        const message = await AuthService.register({ name, email, password, phone_number, otp_verification });

        if (!message) {
            throw Error("Failed to register");
        }

        return successResponse(res, message);
    }

    async refreshToken(req, res) {
        const { refresh_token } = req.body;

        const token = await AuthService.refreshToken(refresh_token);

        if (!token) {
            throw Error("Failed to refresh token");
        }

        return successResponse(res, { access_token: token });
    }

    async getProfile(req, res){
        const user = await AuthService.getProfile(req.user.id);

        if (!user) {
            throw Error("Failed to get user profile");
        }
        
        return successResponse(res, user);
    }

    async updateProfile(req, res){
        const { name, phone_number } = req.body;

        const user = await AuthService.updateProfile(req.user.id, { name, phone_number });

        if (!user) {
            throw Error("Failed to update user profile");
        }

        return successResponse(res, user);
    }

    async sendOtp(req, res) {
        const { email } = req.body;

        const message = await AuthService.sendOtp(email);

        if (!message) {
            throw Error("Failed to send OTP");
        }

        return successResponse(res, message);
    }

    async updateScrictMode(req, res) {
        const updated = await AuthService.updateStrictMode(req.user.id);

        if (!updated) {
            throw Error("Failed to update strict mode");
        }

        return successResponse(res, { message: "Strict mode updated successfully" });
    }
}

export default new AuthController();