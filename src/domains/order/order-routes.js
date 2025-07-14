import BaseRoutes from "../../base_classes/base-routes.js";
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import validateParamsCredentials from "../../middlewares/validate-params-credentials-middleware.js";
import tryCatch from "../../utils/tryCatcher.js";
import OrderController from "./order-controller.js";
import orderSchema from "./order-schema.js";

class OrderRoutes extends BaseRoutes {
	routes() {
		this.router.get("/", [
			authTokenMiddleware.authenticate,
			validateParamsCredentials(orderSchema.params),
			tryCatch(OrderController.getAll),
		]);
		this.router.get("/:orderId", [
			authTokenMiddleware.authenticate,
			tryCatch(OrderController.getById),
		]);
		this.router.post("/", [
			authTokenMiddleware.authenticate,
			authTokenMiddleware.authorizeRoles(["CASHIER"]),
			validateCredentials(orderSchema.create),
			tryCatch(OrderController.create),
		]);
	}
}

export default new OrderRoutes().router;
