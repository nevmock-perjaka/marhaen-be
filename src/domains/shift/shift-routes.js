import express from "express";
import shiftController from "./shift-controller.js";

const router = express.Router();

router.post("/clock-in", shiftController.clockIn);
router.post("/clock-out", shiftController.clockOut);
router.get("/logs", shiftController.getStaffLogs);

export default router;