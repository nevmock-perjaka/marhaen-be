import "dotenv/config";

import { __dirname, __filename } from "./utils/path.js";

import apicache from "apicache";
import compression from "compression";
import cors from "cors";
import errorHandler from "./middlewares/error-handler-middleware.js";
import express from "express";
import helmet from "helmet";
import logger from "./utils/logger.js";
import morgan from "morgan";
import path from "path";
import { queryParser } from "express-query-parser";

import BaseError from "./base_classes/base-error.js";
import routes from "./routes.js";
import { startCancelPendingOrdersScheduler } from "./jobs/cancel-pending-orders.js";

class ExpressApplication {
  app;
  fileStorage;
  fileFilter;
  constructor(port) {
    this.app = express();
    this.port = port;

    this.app.use(express.json({ type: "application/json", limit: "10mb" }));
    this.app.use(queryParser({
      parseNull: true,
      parseBoolean: true,
      parseNumber: true,
    }))
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    //  __init__
    this.configureAssets();
    this.setupLibrary([
      morgan("dev"),
      compression(),
      helmet(),
    ]);
    this.setupRoute();
    this.setupMiddlewares([
      errorHandler,
      express.json(),
      express.urlencoded({ extended: true }),
      apicache.middleware("5 minutes"),
    ]);
  }

  setupMiddlewares(middlewaresArr) {
    middlewaresArr.forEach((middleware) => {
      this.app.use(middleware);
    });
  }
  setupRoute() {
    this.app.use("/api/", routes);

    this.app.use("/*", () => {
      throw BaseError.notFound("Route not found");
    });
  }

  configureAssets() {
    this.app.use('/public', express.static(path.join(__filename, 'public')));
  }

  setupLibrary(libraries) {
    libraries.forEach((library) => {
      if (library != "" && library != null) {
        this.app.use(library);
      }
    });
  }

  start() {
    const server = this.app.listen(this.port, () => {
      logger.info(`Application running on port ${this.port}`);
      
      // Start background jobs
      startCancelPendingOrdersScheduler(
        parseInt(process.env.CANCEL_PENDING_INTERVAL_MIN || '5'),  // Run every 5 minutes
        parseInt(process.env.CANCEL_PENDING_TIMEOUT_MIN || '15')   // Cancel after 15 minutes
      );
    });
    return server;
  }
}

export default ExpressApplication;
