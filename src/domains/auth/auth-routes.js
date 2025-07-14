import BaseRoutes from "../../base_classes/base-routes.js";
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import tryCatch from "../../utils/tryCatcher.js";
import AuthController from "./auth-controller.js";
import {
	loginSchema,
	profileSchema,
	refreshTokenSchema,
	registerSchema,
	sendOtpSchema,
} from "./auth-schema.js";

class AuthRoutes extends BaseRoutes {
	routes() {
		this.router.post("/send-otp", [
			validateCredentials(sendOtpSchema),
			tryCatch(AuthController.sendOtp),
		]);
		this.router.post("/register", [
			validateCredentials(registerSchema),
			tryCatch(AuthController.register),
		]);

		this.router.post("/login", [
			validateCredentials(loginSchema),
			tryCatch(AuthController.login),
		]);

		this.router.post("/refresh-token", [
			validateCredentials(refreshTokenSchema),
			tryCatch(AuthController.refreshToken),
		]);

		this.router.get("/me", [
			authTokenMiddleware.authenticate,
			tryCatch(AuthController.getProfile),
		]);

		this.router.put("/me", [
			authTokenMiddleware.authenticate,
			authTokenMiddleware.authorizeRoles(["OWNER"]),
			validateCredentials(profileSchema),
			tryCatch(AuthController.updateProfile),
		]);

		this.router.put("/strict-mode", [
			authTokenMiddleware.authenticate,
			authTokenMiddleware.authorizeRoles(["CASHIER"]),
			tryCatch(AuthController.updateScrictMode),
		]);
	}
}

export default new AuthRoutes().router;
