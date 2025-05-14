import express from "express";
import ProductRoutes from "./routes/product.routes.js";
import ProductConfigRoutes from "./routes/productConfig.routes.js";
import AddonRoutes from "./routes/addon.routes.js";
import AddonGroupRoutes from "./routes/addonGroup.routes.js";
import addonConfigRoutes from "./routes/addonConfig.routes.js";

const router = express.Router();

router.use("/product", ProductRoutes);
router.use("/product-config", ProductConfigRoutes);
router.use("/addon", AddonRoutes);
router.use("/addon-group", AddonGroupRoutes);
router.use("/addon-config", addonConfigRoutes);

export default router;
