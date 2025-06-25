import BaseRoutes from "../../../base_classes/base-routes.js";
import SubscriptionController from "./subscription-controller.js";

import tryCatch from "../../../utils/tryCatcher.js";
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js'
import { createSubscriptionSchema } from "./subscription-schema.js";

import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";

class SubscriptionRoutes extends BaseRoutes {
    routes() {
        this.router.post("/", [
            authTokenMiddleware.authenticate,
            validateCredentials(createSubscriptionSchema),
            tryCatch(SubscriptionController.create)
        ]);
        this.router.get("/", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(SubscriptionController.getAll)
        ])
    }
}

export default new SubscriptionRoutes().router;