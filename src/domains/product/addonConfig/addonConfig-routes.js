import BaseRoutes from "../../../base_classes/base-routes.js";
import AddonConfigController from "./addonConfig-controller.js";
import tryCatch from "../../../utils/tryCatcher.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import addonConfigSchema from "./addonConfig-schema.js";

class AddonConfigRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      authTokenMiddleware.authenticate,
      tryCatch(AddonConfigController.getAll),
    ]);
    this.router.get("/:id", [
      authTokenMiddleware.authenticate,
      tryCatch(AddonConfigController.getById),
    ]);
    this.router.post("/", [
      authTokenMiddleware.authenticate,
      authTokenMiddleware.authorizeRoles(["STAFF"]),
      validateCredentials(addonConfigSchema.create),
      tryCatch(AddonConfigController.create),
    ]);
    this.router.put("/:id", [
      authTokenMiddleware.authenticate,
      authTokenMiddleware.authorizeRoles(["STAFF"]),
      validateCredentials(addonConfigSchema.update),
      tryCatch(AddonConfigController.update),
    ]);
    this.router.delete("/:id", [
      authTokenMiddleware.authenticate,
      authTokenMiddleware.authorizeRoles(["STAFF"]),
      tryCatch(AddonConfigController.delete),
    ]);
  }
}

export default new AddonConfigRoutes().router;
