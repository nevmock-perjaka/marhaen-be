import BaseRoutes from "../../base_classes/base-routes.js";
import tryCatch from "../../utils/tryCatcher.js";
import MerchantController from "./merchant-controller.js";

class MerchantRoutes extends BaseRoutes {
	routes() {
		this.router.get("/", tryCatch(MerchantController.getAll));
	}
}

export default new MerchantRoutes().router;
