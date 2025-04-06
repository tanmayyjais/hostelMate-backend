// routes/statsRoutes.js
import express from "express";
import {
  getComplaintStats
} from "../controllers/statsController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/complaints", protect, admin, getComplaintStats);

export default router;
