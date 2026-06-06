import BaseRoutes from "../../base_classes/base-routes.js";
import tryCatch from "../../utils/tryCatcher.js";
import PerformanceController from "./performance-controller.js";

class PerformanceRoutes extends BaseRoutes {
	routes() {
		this.router.get("/", tryCatch(PerformanceController.getAll));
	}
}

export default new PerformanceRoutes().router;
