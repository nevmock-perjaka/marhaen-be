import BaseRoutes from "../../../base_classes/base-routes.js";
import ProductConfigController from "../controller/productConfig.controller.js";
import tryCatch from "../../../utils/tryCatcher.js";

class ProductConfigRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(ProductConfigController.getAll));
        this.router.get("/:id", tryCatch(ProductConfigController.getById));
        this.router.post("/", tryCatch(ProductConfigController.create));
        this.router.put("/:id", tryCatch(ProductConfigController.update));
        this.router.delete("/:id", tryCatch(ProductConfigController.delete));
    }
}

export default new ProductConfigRoutes().router;
