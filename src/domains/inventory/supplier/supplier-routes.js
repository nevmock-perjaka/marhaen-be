import BaseRoutes from "../../../base_classes/base-routes.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import tryCatch from "../../../utils/tryCatcher.js";
import SupplierController from "./supplier-controller.js";
import supplierSchema from "./supplier-schema.js";

class SupplierRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            authTokenMiddleware.authenticate,
            tryCatch(SupplierController.getAll)
        ]);
        this.router.get("/:id", [
            authTokenMiddleware.authenticate,
            tryCatch(SupplierController.getById)
        ]);

        this.router.post("/", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(supplierSchema.create),
            tryCatch(SupplierController.create)
        ]);

        this.router.put("/:id",[
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(supplierSchema.update),
            tryCatch(SupplierController.update)
        ]
        );
        this.router.delete("/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            tryCatch(SupplierController.delete)
        ]);
    }
}

export default new SupplierRoutes().router;
