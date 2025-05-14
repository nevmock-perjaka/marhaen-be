import express from "express";
import InventoryRoutes from "./routes/inventory.routes.js";
import InputHistoryRoutes from "./routes/inputHistory.routes.js";
import SupplierRoutes from "./routes/supplier.routes.js";

const router = express.Router();

router.use("/inventory", InventoryRoutes);
router.use("/input-history", InputHistoryRoutes);
router.use("/supplier", SupplierRoutes);

export default router;
