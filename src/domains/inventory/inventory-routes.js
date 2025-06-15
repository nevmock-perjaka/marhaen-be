import BaseRoutes from "../../base_classes/base-routes.js";
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import tryCatch from "../../utils/tryCatcher.js";
import InventoryController from "./inventory-controller.js";
import inventorySchema from "./inventory-schema.js";

class InventoryRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            authTokenMiddleware.authenticate, 
            tryCatch(InventoryController.getAll)
        ]);
        this.router.get("/:id", [
            authTokenMiddleware.authenticate, 
            tryCatch(InventoryController.getById)
        ]);
        this.router.post("/", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(inventorySchema.create),
            tryCatch(InventoryController.create)
        ]);
        this.router.put("/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(inventorySchema.update),
            tryCatch(InventoryController.update)
        ]);
        this.router.delete("/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            tryCatch(InventoryController.delete)
        ]);
    }
}

export default new InventoryRoutes().router;
