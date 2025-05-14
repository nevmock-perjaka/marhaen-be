import express from "express";
import TableRoutes from "./routes/table.routes.js";

const router = express.Router();

router.use("/", TableRoutes);

export default router;
