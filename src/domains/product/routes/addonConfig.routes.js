import BaseRoutes from "../../../base_classes/base-routes.js";
import AddonConfigController from "../controller/addonConfig.controller.js";
import tryCatch from "../../../utils/tryCatcher.js";

class AddonConfigRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(AddonConfigController.getAll));
        this.router.get("/:id", tryCatch(AddonConfigController.getById));
        this.router.post("/", tryCatch(AddonConfigController.create));
        this.router.put("/:id", tryCatch(AddonConfigController.update));
        this.router.delete("/:id", tryCatch(AddonConfigController.delete));
    }
}

export default new AddonConfigRoutes().router;
