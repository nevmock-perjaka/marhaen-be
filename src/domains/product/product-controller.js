import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";
import { successResponse, createdResponse } from "../../utils/response.js";
import ProductService from "./product-service.js";
import uploadFile from "../../middlewares/upload-file-middleware.js";

class ProductController {
  async getAll(req, res) {
    const userId = req.user.id;
    const query = req.query;

    const products = await ProductService.findAll(userId, query);

    return successResponse(res, products.data, products.count, products.meta);
  }

  async getById(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const product = await ProductService.findById(id, userId);

    return successResponse(res, product);
  }

  async create(req, res) {
    const value = req.body;

    value.owned_by = req.user.id;
    value.created_by = req.profile.id;
    value.updated_by = req.profile.id;

    const created = await ProductService.create(value);
    return createdResponse(res, created);
  }

  async update(req, res) {
    const { id } = req.params;
    let value = req.body;

    value.updated_by = req.profile.id;
    value.owned_by = req.user.id;

    const updated = await ProductService.update(id, value);

    return successResponse(res, updated);
  }

  async delete(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = await ProductService.softDelete(id, userId);

    return successResponse(res, deleted);
  }

  async uploadImage(req, res) {
    if (!req.file) {
      throw new BaseError("No file uploaded", 400);
    }

    const relativePath = `/public/product/${req.file.filename}`;

    return successResponse(res, relativePath);
  }

  async import(req, res) {
    if (!req.file) {
      throw new BaseError("No file uploaded", 400);
    }

    const filePath = req.file.path;
    const userId = req.user.id;
    const profileId = req.profile.id;

    // Call the service to handle the import logic
    const importedProducts = await ProductService.import(filePath, userId, profileId);

    return createdResponse(res, importedProducts);
  }
}

export default new ProductController();
