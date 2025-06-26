import BaseRoutes from "../../../../base_classes/base-routes.js";
import authTokenMiddleware from "../../../../middlewares/auth-token-middleware.js";
import validateParamsCredentials from "../../../../middlewares/validate-params-credentials-middleware.js";
import tryCatch from "../../../../utils/tryCatcher.js";
import TransactionController from "./transaction-controller.js";
import transactionSchema from "./transaction-schema.js";

class TransactionRoutes extends BaseRoutes {
    routes(){
        this.router.get("/chart", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            validateParamsCredentials(transactionSchema.params),
            tryCatch(TransactionController.getByRange)
        ]);
    }
}

export default new TransactionRoutes().router;
