import BaseRoutes from "../../../../base_classes/base-routes.js";
import authTokenMiddleware from "../../../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../../../middlewares/validate-credentials-middleware.js";
import tryCatch from "../../../../utils/tryCatcher.js";
import MidtransController from "./midtrans-controller.js";
import { midtransSchema } from "./midtrans-schema.js";

class MidtransRoutes extends BaseRoutes {
	routes() {
		this.router.get("/", [
			authTokenMiddleware.authenticate,
			authTokenMiddleware.authorizeRoles(["OWNER"]),
			tryCatch(MidtransController.get),
		]);

		this.router.put("/", [
			authTokenMiddleware.authenticate,
			authTokenMiddleware.authorizeRoles(["OWNER"]),
			validateCredentials(midtransSchema),
			tryCatch(MidtransController.update),
		]);

		this.router.post("/test-connection", [
			authTokenMiddleware.authenticate,
			authTokenMiddleware.authorizeRoles(["OWNER"]),
			validateCredentials(midtransSchema),
			tryCatch(MidtransController.testConnection),
		]);
	}
}

export default new MidtransRoutes().router;
