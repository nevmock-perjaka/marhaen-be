import express from "express";
import InventoryRoutes from "./inventory-routes.js";
import InputHistoryRoutes from "./inputHistory/inputHistory-routes.js";
import SupplierRoutes from "./supplier/supplier-routes.js";

const router = express.Router();

router.use("/inventory", InventoryRoutes);
router.use("/input-history", InputHistoryRoutes);
router.use("/supplier", SupplierRoutes);

export default router;
