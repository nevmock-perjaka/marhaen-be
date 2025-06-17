import BaseRoutes from "../../base_classes/base-routes.js";
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";
import uploadFile from "../../middlewares/upload-file-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import tryCatch from "../../utils/tryCatcher.js";
import TableController from "./table-controller.js";
import TableSchema from "./table-schema.js";

class TableRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            authTokenMiddleware.authenticate,
            tryCatch(TableController.getAll)
        ]);
        this.router.get("/:tableId", [
            authTokenMiddleware.authenticate,
            tryCatch(TableController.getById)
        ]);
        this.router.post("/", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(TableSchema.create),
            tryCatch(TableController.create)
        ]);
        this.router.put("/:tableId", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(TableSchema.update),
            tryCatch(TableController.update)
        ]);
        this.router.delete("/:tableId", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            tryCatch(TableController.delete)
        ]);

        this.router.post("/upload-image", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            uploadFile('/table', 'image').single('image'),
            tryCatch(TableController.uploadImage)
        ])
    }
}

export default new TableRoutes().router;
