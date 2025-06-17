import express from "express";
import ProfileRoutes from "./profile-routes.js";
import MidtransRoutes from "./config/midtrans/midtrans-routes.js";

const router = express.Router();

router.use("/", ProfileRoutes);
router.use("/config/midtrans", MidtransRoutes)

export default router;