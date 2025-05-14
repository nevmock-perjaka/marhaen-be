import express from "express";
import ProductDiscountRoutes from "./routes/productDiscount.routes.js";
import DiscountRoutes from "./routes/discount.routes.js";

const router = express.Router();
router.use("/product-discount", ProductDiscountRoutes);
router.use("/discount", DiscountRoutes);

export default router;
