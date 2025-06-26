import BaseRoutes from "../../base_classes/base-routes.js";
import ProductController from "./product-controller.js";
import tryCatch from "../../utils/tryCatcher.js";
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import productSchema from "./product-schema.js";
import uploadFile from "../../middlewares/upload-file-middleware.js";
import validateParamsCredentials from "../../middlewares/validate-params-credentials-middleware.js";

class ProductRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            authTokenMiddleware.authenticate,
            validateParamsCredentials(productSchema.params),
            tryCatch(ProductController.getAll)
        ]);
        this.router.get("/:id", [
            authTokenMiddleware.authenticate,
            tryCatch(ProductController.getById)
        ]);
        this.router.post("/", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(productSchema.create),
            tryCatch(ProductController.create)
        ]);
        this.router.put("/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            validateCredentials(productSchema.update),
            tryCatch(ProductController.update)
        ]);
        this.router.delete("/:id", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            tryCatch(ProductController.delete)
        ]);

        this.router.post("/upload-image", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            uploadFile('/product', 'image').single('image'),
            tryCatch(ProductController.uploadImage)
        ])

        this.router.post("/import", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['STAFF']),
            uploadFile('/product-excel', 'document').single('document'),
            tryCatch(ProductController.import)
        ]);
    }
}

export default new ProductRoutes().router;
