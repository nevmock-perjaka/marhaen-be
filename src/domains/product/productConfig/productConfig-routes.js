import BaseRoutes from "../../../base_classes/base-routes.js";
import ProductConfigController from "./productConfig-controller.js";
import tryCatch from "../../../utils/tryCatcher.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import productConfigSchema from "./productConfig-schema.js";
import validateParamsCredentials from "../../../middlewares/validate-params-credentials-middleware.js";

class ProductConfigRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      authTokenMiddleware.authenticate,
      validateParamsCredentials(productConfigSchema.params),
      tryCatch(ProductConfigController.getAll),
    ]);

    this.router.get("/:id", [authTokenMiddleware.authenticate, tryCatch(ProductConfigController.getById)]);

    this.router.post("/", [
      authTokenMiddleware.authenticate,
      authTokenMiddleware.authorizeRoles(["STAFF"]),
      validateCredentials(productConfigSchema.create),
      tryCatch(ProductConfigController.create),
    ]);

    this.router.put("/:id", [
      authTokenMiddleware.authenticate,
      authTokenMiddleware.authorizeRoles(["STAFF"]),
      validateCredentials(productConfigSchema.update),
      tryCatch(ProductConfigController.update),
    ]);

    this.router.delete("/:id", [
      authTokenMiddleware.authenticate,
      authTokenMiddleware.authorizeRoles(["STAFF"]),
      tryCatch(ProductConfigController.delete),
    ]);
  }
}

export default new ProductConfigRoutes().router;
