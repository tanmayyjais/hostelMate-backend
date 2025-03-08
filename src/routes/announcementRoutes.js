import express from "express";
import { getAllAnnouncements, createAnnouncement, deleteAnnouncement } from "../controllers/announcementController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Public route - Get all announcements
router.get("/", getAllAnnouncements);

// Admin routes
router.post("/", protect, admin, upload.single("image"), createAnnouncement);
router.delete("/:id", protect, admin, deleteAnnouncement);

export { router as announcementRouter };
