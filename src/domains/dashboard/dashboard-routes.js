import BaseRoutes from "../../base_classes/base-routes.js";
import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";

// Dashboard
import DashboardController from "./dashboard-controller.js";

// Subdomain Controllers
import NetProfitController from "./metrics/netProfit/net-profit-controller.js";
import SalesPerformanceController from "./metrics/salesPerformance/sales-performance-controller.js";
import IngredientCostController from "./metrics/ingredientCost/ingredient-cost-controller.js";
import TransactionController from "./metrics/transaction/transaction-controller.js";
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";

class DashboardRoutes extends BaseRoutes {
    routes() {
        // Dashboard summary
        this.router.get("/summary", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(DashboardController.index),
        ]);

        // Net Profit
        this.router.get("/net-profit", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(NetProfitController.getByRange)
        ]);

        this.router.get("/net-profit/comparison", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(NetProfitController.getComparison)
        ]);

        // Sales Performance
        this.router.get("/sales-performance", [ 
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(SalesPerformanceController.getByRange)
        ]);

        this.router.get("/sales-performance/comparison", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(SalesPerformanceController.getComparison)
        ]);

        // Ingredient Cost
        this.router.get("/ingredient-cost", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(IngredientCostController.getByRange)
        ]);

        this.router.get("/ingredient-cost/comparison", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(IngredientCostController.getComparison)
        ]);

        // Transaction (no comparison)
        this.router.get("/transaction", [
            authTokenMiddleware.authenticate,
            authTokenMiddleware.authorizeRoles(['OWNER']),
            tryCatch(TransactionController.getByRange)
        ]);
    }
}

export default new DashboardRoutes().router;
