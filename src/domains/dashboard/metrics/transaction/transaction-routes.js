import { Router } from "express";
import TransactionController from "./transaction-controller.js";
import tryCatch from "../../../../common/utils/tryCatcher.js";
import validateCredentials from "../../../../middlewares/validate-credentials-middleware.js";

const router = Router();

router.get(
    "/",
    validateCredentials, 
    tryCatch(TransactionController.getByRange)
);

export default router;
