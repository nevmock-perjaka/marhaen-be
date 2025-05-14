import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import InputHistoryController from "../controller/inputHistory.controller.js";

class InputHistoryRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", tryCatch(InputHistoryController.getAll));
    this.router.get("/:id", tryCatch(InputHistoryController.getById));
    this.router.post("/", tryCatch(InputHistoryController.create));
    this.router.put("/:id", tryCatch(InputHistoryController.update));
    this.router.delete("/:id", tryCatch(InputHistoryController.delete));
  }
}

export default new InputHistoryRoutes().router;
