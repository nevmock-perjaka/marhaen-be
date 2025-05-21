import BaseRoutes from "../../base_classes/base-routes.js";
import tryCatch from "../../utils/tryCatcher.js";
import OrderTransactionController from "./orderTransaction-controller.js";

class OrderTransactionRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(OrderTransactionController.getAll));
        this.router.get("/:orderTransactionId", tryCatch(OrderTransactionController.getById));
        this.router.post("/", tryCatch(OrderTransactionController.create));
        this.router.put("/:orderTransactionId", tryCatch(OrderTransactionController.update));
        this.router.delete("/:orderTransactionId", tryCatch(OrderTransactionController.delete));
    }
}

export default new OrderTransactionRoutes().router;
