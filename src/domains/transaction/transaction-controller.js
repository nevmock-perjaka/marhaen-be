import transactionService from "./transaction-service.js";
import { successResponse } from "../../utils/response.js"

class TransactionController {
    async webhook(req, res) {
        const data = req.body;

        const response = await transactionService.notificationSnap(data);

        return successResponse(res, response);
    }
}

export default new TransactionController();