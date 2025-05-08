import BaseRoutes from "../../base_classes/base-routes.js";
import ShiftController from "./shift-controller.js";
import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { createShiftSchema, updateShiftSchema } from "./shift-schema.js";

class ShiftRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(ShiftController.getAll));
        this.router.get("/:id", tryCatch(ShiftController.getById));
        this.router.post("/", [
            validateCredentials(createShiftSchema),
            tryCatch(ShiftController.create)
        ]);
        this.router.put("/:id", [
            validateCredentials(updateShiftSchema),
            tryCatch(ShiftController.update)
        ]);
        this.router.delete("/:id", tryCatch(ShiftController.delete));
    }
}

export default new ShiftRoutes().router;
