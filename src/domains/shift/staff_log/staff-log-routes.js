import express from "express";
import staffLogController from "./staff-log-controller.js";

const router = express.Router();

router.post("/", staffLogController.createStaffLog);
router.get("/", staffLogController.getStaffLogs);
router.get("/:id", staffLogController.getStaffLogById);
router.delete("/:id", staffLogController.deleteStaffLog);

export default router;