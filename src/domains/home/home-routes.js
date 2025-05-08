import BaseRoutes from "../../base_classes/base-routes.js";
import HomeController from "./home-controller.js";
import tryCatch from "../../utils/tryCatcher.js";

class HomeRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(HomeController.getAll));
    }
}

export default new HomeRoutes().router;
