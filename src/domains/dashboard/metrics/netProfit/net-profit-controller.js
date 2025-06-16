import NetProfitService from "./net-profit-service.js";
import { successResponse, errorResponse } from "../../../../utils/response.js";

class NetProfitController {
    async chartView(req, res) {
        try {
            const { start_date, end_date } = req.query;
            const ownedBy = req.user?.id || req.user?.owned_by; // asumsi pakai JWT dan ada user.id

            if (!start_date || !end_date) {
                return errorResponse(res, 400, "start_date dan end_date harus diisi");
            }

            const data = await NetProfitService.getNetProfitInRange(start_date, end_date, ownedBy);
            return successResponse(res, data, "Net profit berhasil diambil");
        } catch (err) {
            return errorResponse(res, 500, err.message);
        }
    }

    async compareView(req, res) {
        try {
            const { mode } = req.query;
            const ownedBy = req.user?.id || req.user?.owned_by;

            if (!["daily", "weekly", "monthly", "yearly"].includes(mode)) {
                return errorResponse(res, 400, "Mode harus salah satu dari: daily, weekly, monthly, yearly");
            }

            const data = await NetProfitService.compare(mode, ownedBy);
            return successResponse(res, data, `Perbandingan net profit (${mode}) berhasil`);
        } catch (err) {
            return errorResponse(res, 500, err.message);
        }
    }
}

export default new NetProfitController();
