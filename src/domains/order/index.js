import express from "express";
import OrderRoutes from "./order-routes.js";
import OrderItemRoutes from "./orderItem/orderItem-routes.js";
import OrderItemAddonRoutes from "./orderItemAddon/orderItemAddon-routes.js";

const router = express.Router();

router.use("/item/addon", OrderItemAddonRoutes);
router.use("/item", OrderItemRoutes);
router.use("/", OrderRoutes);

export default router;
