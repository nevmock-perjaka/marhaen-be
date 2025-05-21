import BaseRoutes from "../../base_classes/base-routes.js";
import PerformanceController from "./performance-controller.js";
import tryCatch from "../../utils/tryCatcher.js";

class PerformanceRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(PerformanceController.getAll));
    }
}

export default new PerformanceRoutes().router;
