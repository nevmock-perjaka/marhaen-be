import express from "express";
import DashboardRoutes from "./dashboard-routes.js";
import SalesPerformanceRoutes from "./metrics/salesPerformance/sales-performance-routes.js";

const router = express.Router();

router.use("/metrics/sales-performance", SalesPerformanceRoutes);
router.use("/", DashboardRoutes);

export default router;
