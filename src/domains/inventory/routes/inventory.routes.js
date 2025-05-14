import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import InventoryController from "../controller/inventory.controller.js";

class InventoryRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(InventoryController.getAll));
        this.router.get("/:id", tryCatch(InventoryController.getById));
        this.router.post("/", tryCatch(InventoryController.create));
        this.router.put("/:id", tryCatch(InventoryController.update));
        this.router.delete("/:id", tryCatch(InventoryController.delete));
    }
}

export default new InventoryRoutes().router;
