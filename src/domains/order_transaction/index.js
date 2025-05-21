import express from "express";
import OrderTransactionRoutes from "./orderTransaction-routes.js";

const router = express.Router();

router.use("/", OrderTransactionRoutes);

export default router;
