import BaseRoutes from "../../base_classes/base-routes.js";
import ProfileController from "./profile-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from '../../middlewares/validate-credentials-middleware.js';
import { registerSchema, loginSchema, profileSchema, sendOtpSchema, refreshTokenSchema } from './profile-schema.js';
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";

class ProfileRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            authTokenMiddleware.authenticate,
            tryCatch(ProfileController.getAll)
        ])

        this.router.get("/:id", [
            authTokenMiddleware.authenticate,
            tryCatch(ProfileController.getById)
        ]);

        
    }
}

export default new ProfileRoutes().router;