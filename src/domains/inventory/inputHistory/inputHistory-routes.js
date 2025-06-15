import BaseRoutes from "../../../base_classes/base-routes.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import tryCatch from "../../../utils/tryCatcher.js";
import InputHistoryController from "./inputHistory-controller.js";
import inputHistorySchema from "./inputHistory-schema.js";

class InputHistoryRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      authTokenMiddleware.authenticate, 
      tryCatch(InputHistoryController.getAll)
    ]);

    this.router.get("/:id", [
      authTokenMiddleware.authenticate,
      tryCatch(InputHistoryController.getById)
    ]);

    this.router.post("/", [
      authTokenMiddleware.authenticate,
      authTokenMiddleware.authorizeRoles(['STAFF']),
      validateCredentials(inputHistorySchema.create),
      tryCatch(InputHistoryController.create)
    ]);

    this.router.put("/:id", [
      authTokenMiddleware.authenticate,
      authTokenMiddleware.authorizeRoles(['STAFF']),
      validateCredentials(inputHistorySchema.update),
      tryCatch(InputHistoryController.update)
    ]);

    this.router.delete("/:id", [
      authTokenMiddleware.authenticate,
      authTokenMiddleware.authorizeRoles(['STAFF']),
      tryCatch(InputHistoryController.delete)
    ]);
  }
}

export default new InputHistoryRoutes().router;
