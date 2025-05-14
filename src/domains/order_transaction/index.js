import express from "express";
import OrderTransactionRoutes from "./routes/orderTransaction.routes.js";

const router = express.Router();

router.use("/", OrderTransactionRoutes);

export default router;
