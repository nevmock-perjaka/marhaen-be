import stockService from "./stock-service.js";

class StockController {
	async reduceStock(req, res, next) {
		try {
			const { orderId } = req.params;
			await stockService.reduceStockByOrder(orderId);
			res.json({ message: "Stock successfully reduced from order." });
		} catch (err) {
			next(err);
		}
	}

	async addStock(req, res, next) {
		try {
			const { inputHistoryId } = req.params;
			await stockService.addStockFromInput(inputHistoryId);
			res.json({ message: "Stock successfully added from supplier input." });
		} catch (err) {
			next(err);
		}
	}

	async getStock(req, res, next) {
		try {
			const { inventoryId } = req.params;
			const result = await stockService.getStockByInventory(inventoryId);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}
}

export default new StockController();
