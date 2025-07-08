import tryCatch from "../../../../utils/tryCatcher.js";
import NetProfitController from "./net-profit-controller.js";
import validateParamsCredentials from "../../../../middlewares/validate-params-credentials-middleware.js";
import authTokenMiddleware from "../../../../middlewares/auth-token-middleware.js";
import netProfitSchema from "./net-profit-schema.js";
import BaseRoutes from "../../../../base_classes/base-routes.js";

class NetProfitRoutes extends BaseRoutes {
    routes(){
        this.router.get("/chart", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            validateParamsCredentials(netProfitSchema.params),
            tryCatch(NetProfitController.getByRange)
        ]);

        this.router.get("/compare", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(NetProfitController.getComparison)
        ]);
    }
}

export default new NetProfitRoutes().router;
