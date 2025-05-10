import BaseRoutes from "../../../base_classes/base-routes.js";
import SubscriptionController from "./subscription-controller.js";

import tryCatch from "../../../utils/tryCatcher.js";
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js'
import { createSubscriptionSchema } from "./subscription-schema.js";
import authToken from "../../../middlewares/auth-token-middleware.js";

class SubscriptionRoutes extends BaseRoutes {
    routes() {
        this.router.post("/", [
            authToken,
            validateCredentials(createSubscriptionSchema),
            tryCatch(SubscriptionController.create)
        ]);
    }
}

export default new SubscriptionRoutes().router;