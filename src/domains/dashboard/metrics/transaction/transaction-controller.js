import TransactionService from "./transaction-service.js";
import { successResponse, errorResponse } from "../../../../utils/response.js";

class TransactionController {
    async getSoldProducts(req, res) {
        try {
            const { start, end } = req.query;
            const ownedBy = req.user?.id || req.user.owned_by;

            if (!start || !end) {
                return errorResponse(res, 400, "Start and end date are required");
            }

            const data = await TransactionService.getSoldProducts(start, end, ownedBy);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default new TransactionController();
