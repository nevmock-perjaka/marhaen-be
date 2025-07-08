import express from "express";
import DashboardRoutes from "./dashboard-routes.js";
import SalesPerformanceRoutes from "./metrics/salesPerformance/sales-performance-routes.js";
import IngredientCostRoutes from "./metrics/ingredientCost/ingredient-cost-routes.js";
import transactionRoutes from "./metrics/transaction/transaction-routes.js";
import netProfitRoutes from "./metrics/netProfit/net-profit-routes.js";

const router = express.Router();

router.use("/metrics/sales-performance", SalesPerformanceRoutes);
router.use("/metrics/ingredient-cost", IngredientCostRoutes); // Assuming you want to keep this route as well
router.use("/metrics/transaction", transactionRoutes); // Placeholder for other metrics if needed
router.use("/metrics/net-profit", netProfitRoutes); // Assuming you want to keep this route as well
router.use("/", DashboardRoutes);

export default router;
