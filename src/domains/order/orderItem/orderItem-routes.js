import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import OrderItemController from "./orderItem-controller.js";

class OrderItemRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(OrderItemController.getAll));
        this.router.get("/:orderItemId", tryCatch(OrderItemController.getById));
        this.router.post("/", tryCatch(OrderItemController.create));
        this.router.put("/:orderItemId", tryCatch(OrderItemController.update));
        this.router.delete("/:orderItemId", tryCatch(OrderItemController.delete));
    }
}

export default new OrderItemRoutes().router;