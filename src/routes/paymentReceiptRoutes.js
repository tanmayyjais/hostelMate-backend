import express from "express";
import multer from "multer";
import { 
    uploadReceipt, 
    getUserReceipts, 
    getAllReceipts, 
    updateReceiptStatus, 
    deleteReceipt 
} from "../controllers/paymentReceiptController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // ✅ Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// ✅ Apply `admin` middleware for GET all receipts (Admin only)
router.get("/", protect, admin, getAllReceipts); 
router.get("/user", protect, getUserReceipts);
router.post("/", protect, upload.fields([{ name: "receipt", maxCount: 1 }]), uploadReceipt);
router.put("/:id", protect, admin, updateReceiptStatus);
router.delete("/:id", protect, deleteReceipt);

export { router as paymentReceiptRouter };
