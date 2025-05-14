import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import OrderController from "../controller/order.controller.js";

class OrderRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(OrderController.getAll));
        this.router.get("/:orderId", tryCatch(OrderController.getById));
        this.router.post("/", tryCatch(OrderController.create));
        this.router.put("/:orderId", tryCatch(OrderController.update));
        this.router.delete("/:orderId", tryCatch(OrderController.delete));
    }
}

export default new OrderRoutes().router;