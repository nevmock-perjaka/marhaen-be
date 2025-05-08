import BaseRoutes from "../../base_classes/base-routes.js";
import TransactionController from "./transaction-controller.js";
import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import {
    createTransactionSchema,
    updateTransactionSchema
} from "./transaction-schema.js";

class TransactionRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(TransactionController.getAll));
        this.router.get("/:id", tryCatch(TransactionController.getById));
        this.router.post("/", [
            validateCredentials(createTransactionSchema),
            tryCatch(TransactionController.create)
        ]);
        this.router.put("/:id", [
            validateCredentials(updateTransactionSchema),
            tryCatch(TransactionController.update)
        ]);
        this.router.delete("/:id", tryCatch(TransactionController.delete));
    }
}

export default new TransactionRoutes().router;
