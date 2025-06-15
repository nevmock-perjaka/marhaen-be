import express from "express";
import staffLogController from "./staff-log-controller.js";
import tryCatch from "../../../utils/tryCatcher.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import { staffLogSchema } from "./staff-log-schema.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";

const router = express.Router();

router.get("/", [
    authTokenMiddleware.authenticate,
    authTokenMiddleware.authorizeRoles(['OWNER']),
    tryCatch(staffLogController.getStaffLogs)
]);
router.get("/:id", [
    authTokenMiddleware.authenticate,
    authTokenMiddleware.authorizeRoles(['OWNER']),
    tryCatch(staffLogController.getStaffLogById)
]);

export default router;