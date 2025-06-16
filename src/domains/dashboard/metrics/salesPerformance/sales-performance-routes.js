import { Router } from "express";
import SalesPerformanceController from "./sales-performance-controller.js";
import tryCatch from "../../../../utils/tryCatcher.js";
import validateCredentials from "../../../../middlewares/validate-credentials-middleware.js";

const router = Router();

// GET /dashboard/sales-performance/chart?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
router.get(
    "/chart",
    validateCredentials,
    tryCatch(SalesPerformanceController.getPerformanceChart)
);

// GET /dashboard/sales-performance/compare?mode=daily|weekly|monthly|yearly
router.get(
    "/compare",
    validateCredentials,
    tryCatch(SalesPerformanceController.comparePerformance)
);

export default router;
