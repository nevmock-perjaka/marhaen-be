import BaseRoutes from "../../base_classes/base-routes.js";
import ProfileController from "./profile-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from '../../middlewares/validate-credentials-middleware.js';
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";
import { loginSchema } from "./profile-schema.js";

class ProfileRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            authTokenMiddleware.authenticate,
            tryCatch(ProfileController.getAll)
        ])

        this.router.post("/login", [
            authTokenMiddleware.authenticate,
            validateCredentials(loginSchema),
            tryCatch(ProfileController.login)
        ]);

        this.router.get("/me", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authenticateProfile,
            tryCatch(ProfileController.getProfile)
        ]);

        this.router.put("/change-pin/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(ProfileController.updateProfilePin)
        ])
    }
}

export default new ProfileRoutes().router;