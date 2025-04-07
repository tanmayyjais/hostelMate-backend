import express from "express";
import {
   getAllComplaints,
   getUserComplaints,
   createComplaint,
   updateComplaintStatus,
   upload,
   getDepartmentComplaints
} from "../controllers/complaintController.js";

import { protect, admin, departmentAccess } from "../middlewares/authMiddleware.js";
import { getComplaintsByStatus } from "../controllers/complaintController.js";
import { getTodayComplaints, getComplaintStats } from "../controllers/complaintController.js";

const complaintRouter = express.Router();

// Admin - Get all complaints
complaintRouter.route("/").get(protect, admin, getAllComplaints);

// User - Get complaints for themselves
complaintRouter.route("/user").get(protect, getUserComplaints);

// User - Add new complaint with optional image
complaintRouter.route("/").post(protect, upload.single("image"), createComplaint);

// Staff/Admin - Get complaints for their department
complaintRouter.route("/department").get(protect, departmentAccess, getDepartmentComplaints);

// Staff/Admin - Update complaint status
complaintRouter.route("/:id/status").patch(protect, departmentAccess, updateComplaintStatus);
complaintRouter.route("/status").get(protect, departmentAccess, getComplaintsByStatus);
complaintRouter.route("/today").get(protect, getTodayComplaints);
complaintRouter.route("/stats").get(protect, getComplaintStats);

export { complaintRouter };
