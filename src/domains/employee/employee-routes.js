import BaseRoutes from "../../base_classes/base-routes.js";
import EmployeeController from "./employee-controller.js";
import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee-schema.js";

class EmployeeRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(EmployeeController.getAll));
        this.router.get("/:id", tryCatch(EmployeeController.getById));
        this.router.post("/", [
            validateCredentials(createEmployeeSchema),
            tryCatch(EmployeeController.create)
        ]);
        this.router.put("/:id", [
            validateCredentials(updateEmployeeSchema),
            tryCatch(EmployeeController.update)
        ]);
        this.router.delete("/:id", tryCatch(EmployeeController.delete));
    }
}

export default new EmployeeRoutes().router;
