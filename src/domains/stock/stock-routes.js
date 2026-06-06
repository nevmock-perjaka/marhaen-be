import express from "express";
import stockController from "./stock-controller.js";

const router = express.Router();

router.post("/reduce/:orderId", stockController.reduceStock);
router.post("/add/:inputHistoryId", stockController.addStock);
router.get("/:inventoryId", stockController.getStock);

export default router;
