import NetProfitService from "./metrics/netProfit/net-profit-service.js";
import SalesPerformanceService from "./metrics/salesPerformance/sales-performance-service.js";
import IngredientCostService from "./metrics/ingredientCost/ingredient-cost-service.js";
import TransactionService from "./metrics/transaction/transaction-service.js";

class DashboardService {
    netProfit = NetProfitService;
    salesPerformance = SalesPerformanceService;
    ingredientCost = IngredientCostService;
    transaction = TransactionService;
}

export default new DashboardService();
