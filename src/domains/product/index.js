import express from "express";
import ProductRoutes from "./product-routes.js";
import ProductConfigRoutes from "./productConfig/productConfig-routes.js";
import AddonRoutes from "./addon/addon-routes.js";
import AddonGroupRoutes from "./addonGroup/addonGroup-routes.js";
import addonConfigRoutes from "./addonConfig/addonConfig-routes.js";

const router = express.Router();

router.use("/product", ProductRoutes);
router.use("/product-config", ProductConfigRoutes);
router.use("/addon", AddonRoutes);
router.use("/addon-group", AddonGroupRoutes);
router.use("/addon-config", addonConfigRoutes);

export default router;
