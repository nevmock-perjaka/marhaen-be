import express from "express";
import staffController from "./staff-controller.js";
import tryCatch from "../../../utils/tryCatcher.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import staffSchema from "./staff-schema.js";

const router = express.Router();

router.get("/", [
    authTokenMiddleware.authenticate,
    tryCatch(staffController.getAll)
]);
router.get("/:staffId", [
    authTokenMiddleware.authenticate,
    tryCatch(staffController.getById)
]);
router.post("/", [
    authTokenMiddleware.authenticate,
    authTokenMiddleware.authorizeRoles(['STAFF']),
    validateCredentials(staffSchema.create),
    tryCatch(staffController.create)
]);
router.put("/:staffId", [
    authTokenMiddleware.authenticate,
    authTokenMiddleware.authorizeRoles(['STAFF']),
    validateCredentials(staffSchema.update),
    tryCatch(staffController.update)
]);
router.delete("/:staffId", [
    authTokenMiddleware.authenticate,
    authTokenMiddleware.authorizeRoles(['STAFF']),
    tryCatch(staffController.delete)
]);

export default router;