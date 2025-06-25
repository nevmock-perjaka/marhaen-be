import SalesPerformanceController from "./sales-performance-controller.js";
import tryCatch from "../../../../utils/tryCatcher.js";
import authTokenMiddleware from "../../../../middlewares/auth-token-middleware.js";
import BaseRoutes from "../../../../base_classes/base-routes.js";
import validateParamsCredentials from "../../../../middlewares/validate-params-credentials-middleware.js";
import salesPerformanceSchema from "./sales-performance-schema.js";

class SalesPerformanceRoutes extends BaseRoutes {
    routes(){
        this.router.get("/chart", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            validateParamsCredentials(salesPerformanceSchema.params),
            tryCatch(SalesPerformanceController.getByRange)
        ]);

        this.router.get("/compare", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(SalesPerformanceController.getComparison)
        ]);
    }
}


export default new SalesPerformanceRoutes().router;
