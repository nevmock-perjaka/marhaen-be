import express from "express";
import ProductDiscountRoutes from "./productDiscount/productDiscount-routes.js";
import DiscountRoutes from "./discount-routes.js";

const router = express.Router();
router.use("/product-discount", ProductDiscountRoutes);
router.use("/", DiscountRoutes);

export default router;
