import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import TableController from "../controller/table.controller.js";

class TableRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(TableController.getAll));
        this.router.get("/:tableId", tryCatch(TableController.getById));
        this.router.post("/", tryCatch(TableController.create));
        this.router.put("/:tableId", tryCatch(TableController.update));
        this.router.delete("/:tableId", tryCatch(TableController.delete));
    }
}

export default new TableRoutes().router;
