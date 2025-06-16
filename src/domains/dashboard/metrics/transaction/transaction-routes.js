import { Router } from "express";
import TransactionController from "./transaction-controller.js";
import tryCatch from "../../../../common/utils/tryCatcher.js";
import validateCredentials from "../../../../middlewares/validate-credentials-middleware.js";

const router = Router();

// Endpoint: /dashboard/metrics/transaction?s=startDate&e=endDate
router.get("/", [validateCredentials, tryCatch(TransactionController.getSoldProducts)]);

export default router;
