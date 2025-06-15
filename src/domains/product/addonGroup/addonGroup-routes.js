import BaseRoutes from "../../../base_classes/base-routes.js";
import AddonGroupController from "./addonGroup-controller.js";
import tryCatch from "../../../utils/tryCatcher.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import addonGroupSchema from "./addonGroup-schema.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";

class AddonGroupRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            authTokenMiddleware.authenticate,
            tryCatch(AddonGroupController.getAll)
        ]);
        this.router.get("/:id", [
            authTokenMiddleware.authenticate,
            tryCatch(AddonGroupController.getById)
        ]);
        this.router.post("/", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(addonGroupSchema.create),
            tryCatch(AddonGroupController.create)
        ]);
        this.router.put("/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(addonGroupSchema.update),
            tryCatch(AddonGroupController.update)
        ]);
        this.router.delete("/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            tryCatch(AddonGroupController.delete)
        ]);
    }
}

export default new AddonGroupRoutes().router;