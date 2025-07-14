import express from "express";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import validateParamsCredentials from "../../../middlewares/validate-params-credentials-middleware.js";
import tryCatch from "../../../utils/tryCatcher.js";
import staffLogController from "./staff-log-controller.js";
import staffLogSchema from "./staff-log-schema.js";

const router = express.Router();

router.get("/", [
	authTokenMiddleware.authenticate,
	authTokenMiddleware.authorizeRoles(["OWNER"]),
	validateParamsCredentials(staffLogSchema.params),
	tryCatch(staffLogController.getStaffLogs),
]);
router.get("/:id", [
	authTokenMiddleware.authenticate,
	authTokenMiddleware.authorizeRoles(["OWNER"]),
	tryCatch(staffLogController.getStaffLogById),
]);

export default router;
