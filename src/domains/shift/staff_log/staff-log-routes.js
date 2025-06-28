import express from "express";
import staffLogController from "./staff-log-controller.js";
import tryCatch from "../../../utils/tryCatcher.js";
import staffLogSchema from "./staff-log-schema.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import validateParamsCredentials from "../../../middlewares/validate-params-credentials-middleware.js";

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
