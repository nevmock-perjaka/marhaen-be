const isAuthOn = process.env.AUTH_ON === "true";
const applyAuth = (middleware) => (isAuthOn ? [middleware] : []);

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
        this.router.get(
            "/summary",
            [...applyAuth(validateCredentials), tryCatch(DashboardController.index)]
        );

        this.router.get(
            "/net-profit",
            [...applyAuth(validateCredentials), tryCatch(NetProfitController.getByRange)]
        );
        this.router.get(
            "/net-profit/comparison",
            [...applyAuth(validateCredentials), tryCatch(NetProfitController.getComparison)]
        );

        this.router.get(
            "/sales-performance",
            [...applyAuth(validateCredentials), tryCatch(SalesPerformanceController.getByRange)]
        );
        this.router.get(
            "/sales-performance/comparison",
            [...applyAuth(validateCredentials), tryCatch(SalesPerformanceController.getComparison)]
        );

        this.router.get(
            "/ingredient-cost",
            [...applyAuth(validateCredentials), tryCatch(IngredientCostController.getByRange)]
        );
        this.router.get(
            "/ingredient-cost/comparison",
            [...applyAuth(validateCredentials), tryCatch(IngredientCostController.getComparison)]
        );

        this.router.get(
            "/transaction",
            [...applyAuth(validateCredentials), tryCatch(TransactionController.getByRange)]
        );
    }
}

export default new DashboardRoutes().router;
