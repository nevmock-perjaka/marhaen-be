import BaseRoutes from "../../base_classes/base-routes.js";
import MerchantController from "./merchant-controller.js";
import tryCatch from "../../utils/tryCatcher.js";

class MerchantRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(MerchantController.getAll));
    }
}

export default new MerchantRoutes().router;
