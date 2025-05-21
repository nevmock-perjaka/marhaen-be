import BaseRoutes from "../../../base_classes/base-routes.js";
import AddonController from "./addon-controller.js";
import tryCatch from "../../../utils/tryCatcher.js";

class AddonRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(AddonController.getAll));
        this.router.get("/:id", tryCatch(AddonController.getById));
        this.router.post("/", tryCatch(AddonController.create));
        this.router.put("/:id", tryCatch(AddonController.update));
        this.router.delete("/:id", tryCatch(AddonController.delete));
    }
}

export default new AddonRoutes().router;