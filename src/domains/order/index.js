import express from "express";
import OrderRoutes from "./routes/order.routes.js";
import OrderItemRoutes from "./routes/orderItem.routes.js";
import OrderItemAddonRoutes from "./routes/orderItemAddon.routes.js";

const router = express.Router();

router.use("/order", OrderRoutes);
router.use("/order-item", OrderItemRoutes);
router.use("/order-item-addon", OrderItemAddonRoutes);

export default router;
