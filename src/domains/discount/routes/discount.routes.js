import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import DiscountController from "../controller/discount.controller.js";

class DiscountRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(DiscountController.getAll));
        this.router.get("/:id", tryCatch(DiscountController.getById));
        this.router.post("/", tryCatch(DiscountController.create));
        this.router.put("/:id", tryCatch(DiscountController.update));
        this.router.delete("/:id", tryCatch(DiscountController.delete));
    }
}

export default new DiscountRoutes().router;
