import express from "express";
import staffController from "./staff-controller.js";

const router = express.Router();

router.post("/", staffController.createStaff);
router.get("/", staffController.getStaffs);
router.get("/:staffId", staffController.getStaffById);
router.put("/:staffId", staffController.updateStaff);
router.delete("/:staffId", staffController.deleteStaff);

export default router;