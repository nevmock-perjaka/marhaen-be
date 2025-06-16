import { Router } from "express";
import tryCatch from "../../../../utils/tryCatcher.js";
import NetProfitController from "./net-profit-controller.js";
import validateCredentials from "../../../../middlewares/validate-credentials-middleware.js";

const router = Router();

router.get("/chart", validateCredentials, tryCatch(NetProfitController.chartView));
router.get("/compare", validateCredentials, tryCatch(NetProfitController.compareView));

export default router;
