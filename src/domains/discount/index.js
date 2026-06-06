import express from "express";
import DiscountRoutes from "./discount-routes.js";
import ProductDiscountRoutes from "./productDiscount/productDiscount-routes.js";

const router = express.Router();
router.use("/product-discount", ProductDiscountRoutes);
router.use("/", DiscountRoutes);

export default router;
