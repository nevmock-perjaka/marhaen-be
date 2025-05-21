import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import OrderItemAddonController from "./orderItemAddon-controller.js";

class OrderItemAddonRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(OrderItemAddonController.getAll));
        this.router.get("/:orderItemAddonId", tryCatch(OrderItemAddonController.getById));
        this.router.post("/", tryCatch(OrderItemAddonController.create));
        this.router.put("/:orderItemAddonId", tryCatch(OrderItemAddonController.update));
        this.router.delete("/:orderItemAddonId", tryCatch(OrderItemAddonController.delete));
    }
}

export default new OrderItemAddonRoutes().router;