import express from "express";
import ShiftRoutes from "./shift-routes.js";
import StaffRoutes from "./staff/staff-routes.js";
import StaffLogRoutes from "./staff_log/staff-log-routes.js";

const router = express.Router();

router.use("/", ShiftRoutes); // /api/v1/shift
router.use("/staff", StaffRoutes); // /api/v1/shift/staff
router.use("/staff_log", StaffLogRoutes); // /api/v1/shift/staff_log

export default router;