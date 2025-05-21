import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import ProductDiscountController from "./productDiscount-controller.js";

class ProductDiscountRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(ProductDiscountController.getAll));
        this.router.get("/:id", tryCatch(ProductDiscountController.getById));
        this.router.post("/", tryCatch(ProductDiscountController.create));
        this.router.put("/:id", tryCatch(ProductDiscountController.update));
        this.router.delete("/:id", tryCatch(ProductDiscountController.delete));
    }
}

export default new ProductDiscountRoutes().router;