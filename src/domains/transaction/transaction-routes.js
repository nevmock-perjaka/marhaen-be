import BaseRoutes from "../../base_classes/base-routes.js";

import tryCatch from "../../utils/tryCatcher.js";
import transactionController from "./transaction-controller.js";

class TransactionRoutes extends BaseRoutes {
    routes() {
        this.router.post("/webhook", [
            tryCatch(transactionController.webhook)
        ]);
    }
}

export default new TransactionRoutes().router;