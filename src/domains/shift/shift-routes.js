import express from "express";
import authTokenMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import tryCatch from "../../utils/tryCatcher.js";
import shiftController from "./shift-controller.js";
import shiftSchema from "./shift-schema.js";

const router = express.Router();

router.post("/clock-in", [
	authTokenMiddleware.authenticate,
	authTokenMiddleware.authorizeRoles(["CASHIER"]),
	validateCredentials(shiftSchema),
	tryCatch(shiftController.clockIn),
]);
router.post("/clock-out", [
	authTokenMiddleware.authenticate,
	authTokenMiddleware.authorizeRoles(["CASHIER"]),
	tryCatch(shiftController.clockOut),
]);
router.get("/active-shift", [
	authTokenMiddleware.authenticate,
	tryCatch(shiftController.getActiveShift),
]);
router.get("/logs", [tryCatch(shiftController.getStaffLogs)]);

export default router;
