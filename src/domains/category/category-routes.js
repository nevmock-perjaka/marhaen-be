import BaseRoutes from "../../base_classes/base-routes.js";
import CategoryController from "./category-controller.js";
import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { createCategorySchema, updateCategorySchema } from "./category-schema.js";

class CategoryRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", tryCatch(CategoryController.getAll));
        this.router.get("/:id", tryCatch(CategoryController.getById));
        this.router.post("/", [
            validateCredentials(createCategorySchema),
            tryCatch(CategoryController.create)
        ]);
        this.router.put("/:id", [
            validateCredentials(updateCategorySchema),
            tryCatch(CategoryController.update)
        ]);
        this.router.delete("/:id", tryCatch(CategoryController.delete));
    }
}

export default new CategoryRoutes().router;
