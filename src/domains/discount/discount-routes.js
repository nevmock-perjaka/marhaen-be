import BaseRoutes from "../../base_classes/base-routes.js";
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import validateParamsCredentials from "../../middlewares/validate-params-credentials-middleware.js";
import tryCatch from "../../utils/tryCatcher.js";
import DiscountController from "./discount-controller.js";
import discountSchema from "./discount-schema.js";

class DiscountRoutes extends BaseRoutes {
	routes() {
		this.router.get("/", [
			authTokenMiddleware.authenticate,
			validateParamsCredentials(discountSchema.params),
			tryCatch(DiscountController.getAll),
		]);
		this.router.get("/:id", [
			authTokenMiddleware.authenticate,
			tryCatch(DiscountController.getById),
		]);
		this.router.post("/", [
			authTokenMiddleware.authenticate,
			authTokenMiddleware.authorizeRoles(["OWNER"]),
			validateCredentials(discountSchema.create),
			tryCatch(DiscountController.create),
		]);
		this.router.put("/:id", [
			authTokenMiddleware.authenticate,
			authTokenMiddleware.authorizeRoles(["OWNER"]),
			validateCredentials(discountSchema.update),
			tryCatch(DiscountController.update),
		]);
		this.router.delete("/:id", [
			authTokenMiddleware.authenticate,
			authTokenMiddleware.authorizeRoles(["OWNER"]),
			tryCatch(DiscountController.delete),
		]);
	}
}

export default new DiscountRoutes().router;
