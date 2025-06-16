import { Router } from "express";
import tryCatch from "../../../../utils/tryCatcher.js";
import NetProfitController from "./net-profit-controller.js";
import validateCredentials from "../../../../middlewares/validate-credentials-middleware.js";

const router = Router();

router.get(
    "/",
    validateCredentials,
    tryCatch(NetProfitController.getByRange));

router.get(
    "/compare",
    validateCredentials,
    tryCatch(NetProfitController.getComparison));

export default router;
