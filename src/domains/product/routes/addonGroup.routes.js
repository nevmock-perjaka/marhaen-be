import BaseRoutes from "../../../base_classes/base-routes.js";
import AddonGroupController from "../controller/addonGroup.controller.js";
import tryCatch from "../../../utils/tryCatcher.js";

class AddonGroupRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(AddonGroupController.getAll));
        this.router.get("/:id", tryCatch(AddonGroupController.getById));
        this.router.post("/", tryCatch(AddonGroupController.create));
        this.router.put("/:id", tryCatch(AddonGroupController.update));
        this.router.delete("/:id", tryCatch(AddonGroupController.delete));
    }
}

export default new AddonGroupRoutes().router;