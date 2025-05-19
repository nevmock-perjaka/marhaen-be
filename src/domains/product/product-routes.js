import BaseRoutes from "../../base_classes/base-routes.js";
import ProductController from "./product-controller.js";
import tryCatch from "../../utils/tryCatcher.js";

class ProductRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(ProductController.getAll));
        this.router.get("/:id", tryCatch(ProductController.getById));
        this.router.post("/", tryCatch(ProductController.create));
        this.router.put("/:id", tryCatch(ProductController.update));
        this.router.delete("/:id", tryCatch(ProductController.delete));
    }
}

export default new ProductRoutes().router;
