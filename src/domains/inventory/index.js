import express from "express";
import InventoryRoutes from "./inventory-routes.js";
import InputHistoryRoutes from "./inputHistory/inputHistory-routes.js";
import SupplierRoutes from "./supplier/supplier-routes.js";

const router = express.Router();

router.use("/input-history", InputHistoryRoutes);
router.use("/supplier", SupplierRoutes);
router.use("/", InventoryRoutes);

export default router;
