import express from "express";
import { requestGatePass, getUserGatePasses, getAllGatePasses, updateGatePassStatus } from "../controllers/gatePassController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
   .post(protect, requestGatePass)
   .get(protect, getUserGatePasses);
router.route("/admin").get(protect, admin, getAllGatePasses); // ✅ New Route for Admins
router.route("/:id").put(protect, admin, updateGatePassStatus);

export {router as gatePassRouter};
