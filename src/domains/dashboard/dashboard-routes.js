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

class DashboardRoutes extends BaseRoutes {
    routes() {
        // Dashboard summary
        this.router.get(
            "/summary",
            [validateCredentials, tryCatch(DashboardController.index),]
        );

        // Net Profit
        this.router.get(
            "/net-profit",
            [validateCredentials, tryCatch(NetProfitController.getByRange)]
        );
        this.router.get(
            "/net-profit/comparison",
            [validateCredentials, tryCatch(NetProfitController.getComparison)]
        );

        // Sales Performance
        this.router.get(
            "/sales-performance",
            [validateCredentials, tryCatch(SalesPerformanceController.getByRange)]
        );
        this.router.get(
            "/sales-performance/comparison",
            [validateCredentials, tryCatch(SalesPerformanceController.getComparison)]
        );

        // Ingredient Cost
        this.router.get(
            "/ingredient-cost",
            [validateCredentials, tryCatch(IngredientCostController.getByRange)]
        );
        this.router.get(
            "/ingredient-cost/comparison",
            [validateCredentials, tryCatch(IngredientCostController.getComparison)]
        );

        // Transaction (no comparison)
        this.router.get(
            "/transaction",
            [validateCredentials, tryCatch(TransactionController.getByRange)]
        );
    }
}

export default new DashboardRoutes().router;
