import "dotenv/config";

import { __dirname, __filename } from "./utils/path.js";

import apicache from "apicache";
import compression from "compression";
import cors from "cors";
import errorHandler from "./middlewares/error-handler-middleware.js";
import express from "express";
import helmet from "helmet";
import logger from "./utils/logger.js";
import multer from "multer";
import path from "path";

import BaseError from "./base_classes/base-error.js";

import { authV1, authV2 } from "./domains/auth/auth-routes.js";
import subscriptionRoutes from "./domains/transaction/subscription/subscription-routes.js";
import planRoutes from "./domains/plan/plan-routes.js";
import transactionRoutes from "./domains/transaction/transaction-routes.js";

import productModuleRaw from "./domains/product/index.js";
import inventoryModuleRaw from "./domains/inventory/index.js";
import discountModuleRaw from "./domains/discount/index.js";
import tableModuleRaw from "./domains/table/index.js";
import orderModuleRaw from "./domains/order/index.js";
import orderTransactionModuleRaw from "./domains/order_transaction/index.js";

const productModule = productModuleRaw?.default || productModuleRaw;
const inventoryModule = inventoryModuleRaw?.default || inventoryModuleRaw;
const discountModule = discountModuleRaw?.default || discountModuleRaw;
const tableModule = tableModuleRaw?.default || tableModuleRaw;
const orderModule = orderModuleRaw?.default || orderModuleRaw;
const orderTransactionModule = orderTransactionModuleRaw?.default || orderTransactionModuleRaw;

class ExpressApplication {
  app;
  fileStorage;
  fileFilter;
  constructor(port) {
    this.app = express();
    this.port = port;

    this.app.use(express.json({ type: "application/json" }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    //  __init__
    this.configureAssets();
    this.setupRoute();
    this.setupMiddlewares([
      errorHandler,
      express.json(),
      express.urlencoded(),
      apicache.middleware("5 minutes"),
    ]);
    this.setupLibrary([
      process.env.NODE_ENV === "development" ? morgan("dev") : "",
      compression(),
      helmet(),
      // cors(),
    ]);

    this.fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/images");
      },
      filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "-" + file.originalname);
      },
    });
    this.fileFilter = (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
    this.app.use(
      multer({
        storage: this.fileStorage,
        fileFilter: this.fileFilter,
      }).fields([
        {
          name: "image",
          maxCount: 1,
        },
      ])
    );
  }

  setupMiddlewares(middlewaresArr) {
    middlewaresArr.forEach((middleware) => {
      this.app.use(middleware);
    });
  }
  setupRoute() {
    // this.app.use("/api/v1/menu", menuRoutes);

    // this.app.use("/api/v1/auth", authRoutes);
    this.app.use("/api/v1/auth", authV1);
    this.app.use("/api/v2/auth", authV2);
    
    this.app.use("/api/v1/plan", planRoutes);
    this.app.use("/api/v1/subscription", subscriptionRoutes);
    this.app.use("/api/v1/transaction", transactionRoutes);

    this.app.use("/api/v1/product", productModule);
    this.app.use("/api/v1/inventory", inventoryModule);
    this.app.use("/api/v1/discount", discountModule);
    this.app.use("/api/v1/table", tableModule);
    this.app.use("/api/v1/order", orderModule);
    this.app.use("/api/v1/order-transaction", orderTransactionModule);

    this.app.use("/*", () => {
      throw BaseError.notFound("Route not found");
    });
  }

  configureAssets() {
    this.app.use(express.static(path.join(__filename, "public")));
  }

  setupLibrary(libraries) {
    libraries.forEach((library) => {
      if (library != "" && library != null) {
        this.app.use(library);
      }
    });
  }

  start() {
    return this.app.listen(this.port, () => {
      logger.info(`Application running on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
