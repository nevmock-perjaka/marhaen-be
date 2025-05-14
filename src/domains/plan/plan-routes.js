import BaseRoutes from "../../base_classes/base-routes.js";
import PlanController from "./plan-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from '../../middlewares/validate-credentials-middleware.js';
import { createPlanSchema, updatePlanSchema } from "./plan-schema.js";

class PlanRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            tryCatch(PlanController.index)
        ]);

        this.router.get("/:id", [
            tryCatch(PlanController.show)
        ]);

        this.router.post("/", [
            validateCredentials(createPlanSchema),
            tryCatch(PlanController.create)
        ]);

        this.router.put("/:id", [
            validateCredentials(updatePlanSchema),
            tryCatch(PlanController.update)
        ]);

        this.router.delete("/:id", [
            tryCatch(PlanController.delete)
        ]);
    }
}

export default new PlanRoutes().router;