import express from "express";
import { getAllComplaints, getUserComplaints, createComplaint, updateComplaintStatus ,upload } from "../controllers/complaintController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const complaintRouter = express.Router();

// Admin - Get all complaints
complaintRouter.route("/").get(protect, admin, getAllComplaints);

// User - Get complaints for a specific user
complaintRouter.route("/user").get(protect, getUserComplaints);

// User - Add a new complaint (supports image upload)
complaintRouter.route("/").post(protect, upload.single("image"), createComplaint);

// Admin - Update complaint status
complaintRouter.route("/:id/status").patch(protect, admin, updateComplaintStatus);


export { complaintRouter };
