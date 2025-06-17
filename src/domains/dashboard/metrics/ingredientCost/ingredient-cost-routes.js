import express from "express";
import ingredientCostController from "./ingredient-cost-controller.js";
import tryCatch from "../../../../common/utils/tryCatcher.js";
import validateCredentials from "../../../../middlewares/validate-credentials-middleware.js";

const router = express.Router();

router.get(
    "/",
    validateCredentials,
    tryCatch(ingredientCostController.getByRange)
);

router.get(
    "/compare",
    validateCredentials,
    tryCatch(ingredientCostController.getComparison)
);

export default router;
