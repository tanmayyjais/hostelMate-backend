import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { 
    uploadReceipt, 
    getUserReceipts, 
    getAllReceipts, 
    updateReceiptStatus, 
    deleteReceipt 
} from "../controllers/paymentReceiptController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Apply `admin` middleware for GET all receipts (Admin only)
router.get("/", protect, admin, getAllReceipts); 
router.get("/user", protect, getUserReceipts);
router.post("/", protect, upload.single("receipt"), uploadReceipt);
router.put("/:id", protect, admin, updateReceiptStatus);
router.delete("/:id", protect, deleteReceipt);

export { router as paymentReceiptRouter };
