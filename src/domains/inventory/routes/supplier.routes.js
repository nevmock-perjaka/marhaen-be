import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import SupplierController from "../controller/supplier.controller.js";

class SupplierRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(SupplierController.getAll));
        this.router.get("/:id", tryCatch(SupplierController.getById));
        this.router.post("/", tryCatch(SupplierController.create));
        this.router.put("/:id", tryCatch(SupplierController.update));
        this.router.delete("/:id", tryCatch(SupplierController.delete));
    }
}

export default new SupplierRoutes().router;
