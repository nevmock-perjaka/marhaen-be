import express from "express";
import ProductRoutes from "./product-routes.js";
import ProductConfigRoutes from "./productConfig/productConfig-routes.js";
import AddonRoutes from "./addon/addon-routes.js";
import AddonGroupRoutes from "./addonGroup/addonGroup-routes.js";
import addonConfigRoutes from "./addonConfig/addonConfig-routes.js";

const router = express.Router();

router.use("/config", ProductConfigRoutes);
router.use("/addon/config", addonConfigRoutes);
router.use("/addon-group", AddonGroupRoutes);
router.use("/addon", AddonRoutes);
router.use("/", ProductRoutes);

export default router;
