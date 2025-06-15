import express from "express";
import staffController from "./staff-controller.js";
import tryCatch from "../../../utils/tryCatcher.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import staffSchema from "./staff-schema.js";

const router = express.Router();

router.get("/", [
    authTokenMiddleware.authenticate,
    tryCatch(staffController.getStaffs)
]);
router.get("/:staffId", [
    authTokenMiddleware.authenticate,
    tryCatch(staffController.getStaffById)
]);
router.post("/", [
    authTokenMiddleware.authenticate,
    authTokenMiddleware.authorizeRoles(['STAFF']),
    validateCredentials(staffSchema.create),
    tryCatch(staffController.createStaff)
]);
router.put("/:staffId", [
    authTokenMiddleware.authenticate,
    authTokenMiddleware.authorizeRoles(['STAFF']),
    validateCredentials(staffSchema.update),
    tryCatch(staffController.updateStaff)
]);
router.delete("/:staffId", [
    authTokenMiddleware.authenticate,
    authTokenMiddleware.authorizeRoles(['STAFF']),
    tryCatch(staffController.deleteStaff)
]);

export default router;