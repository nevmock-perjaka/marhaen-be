import ingredientCostController from "./ingredient-cost-controller.js";
import ingredientCostSchema from "./ingredient-cost-schema.js";
import BaseRoutes from "../../../../base_classes/base-routes.js";
import tryCatch from "../../../../utils/tryCatcher.js";
import validateParamsCredentials from "../../../../middlewares/validate-params-credentials-middleware.js";
import authTokenMiddleware from "../../../../middlewares/auth-token-middleware.js";


class IngredientCostRoutes extends BaseRoutes {
    routes(){
        this.router.get("/chart", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            validateParamsCredentials(ingredientCostSchema.params),
            tryCatch(ingredientCostController.getByRange)
        ]);
        
        this.router.get("/compare",
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(ingredientCostController.getComparison)
        );
    }
}


export default new IngredientCostRoutes().router;
