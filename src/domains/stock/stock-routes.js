import BaseRoutes from "../../base_classes/base-routes.js";
import StockController from "./stock-controller.js";
import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { createStockSchema, updateStockSchema } from "./stock-schema.js";

class StockRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(StockController.getAll));
        this.router.get("/:id", tryCatch(StockController.getById));
        this.router.post("/", [
            validateCredentials(createStockSchema),
            tryCatch(StockController.create)
        ]);
        this.router.put("/:id", [
            validateCredentials(updateStockSchema),
            tryCatch(StockController.update)
        ]);
        this.router.delete("/:id", tryCatch(StockController.delete));
    }
}

export default new StockRoutes().router;
