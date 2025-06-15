import BaseRoutes from "../../../base_classes/base-routes.js";
import AddonController from "./addon-controller.js";
import tryCatch from "../../../utils/tryCatcher.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import addonSchema from "./addon-schema.js";

class AddonRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            authTokenMiddleware.authenticate,
            tryCatch(AddonController.getAll)
        ]);
        this.router.get("/:id", [
            authTokenMiddleware.authenticate,
            tryCatch(AddonController.getById)
        ]);
        this.router.post("/", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(addonSchema.create), 
            tryCatch(AddonController.create)
        ]);
        this.router.put("/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(addonSchema.update),
            tryCatch(AddonController.update)
        ]);
        this.router.delete("/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            tryCatch(AddonController.delete)
        ]);
    }
}

export default new AddonRoutes().router;