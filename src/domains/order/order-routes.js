import BaseRoutes from "../../base_classes/base-routes.js";
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import tryCatch from "../../utils/tryCatcher.js";
import OrderController from "./order-controller.js";
import orderSchema from "./order-schema.js";

class OrderRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            authTokenMiddleware.authenticate,
            tryCatch(OrderController.getAll)
        ]);
        this.router.get("/:orderId", [
            authTokenMiddleware.authenticate,
            tryCatch(OrderController.getById)
        ]);
        this.router.post("/", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['CASHIER']),
            validateCredentials(orderSchema.create),
            tryCatch(OrderController.create)
        ]);

        this.router.post("/:orderId/confirm-payment", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['CASHIER']),
            tryCatch(OrderController.confirmPayment)
        ]);

        this.router.post("/:orderId/cancel", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['CASHIER']),
            tryCatch(OrderController.cancelOrder)
        ]);
    }
}

export default new OrderRoutes().router;
