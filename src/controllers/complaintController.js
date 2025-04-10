import asyncHandler from "express-async-handler";
import { Complaint } from "../models/complaintModel.js";
import multer from "multer";
import path from "path";
import axios from "axios";

// Set up Multer storage
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files in the "uploads" folder
   },
   filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
   },
});

// Filter for images only
const fileFilter = (req, file, cb) => {
   const allowedTypes = /jpeg|jpg|png/;
   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
   const mimetype = allowedTypes.test(file.mimetype);

   if (extname && mimetype) {
      return cb(null, true);
   } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed"));
   }
};

// Initialize Multer
const upload = multer({ storage, fileFilter });

// @desc    Get all complaints for admin
// @route   GET /api/complaints
// @access  Admin
const getAllComplaints = asyncHandler(async (req, res) => {
   const complaints = await Complaint.find()
      .populate("user", "full_name email")
      .sort({ createdAt: -1 });

   res.json(complaints);
});

// @desc    Get complaints for a specific user
// @route   GET /api/complaints/user
// @access  User
const getUserComplaints = asyncHandler(async (req, res) => {
   const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
   res.json(complaints);
});

// @desc    Add a new complaint with optional image
// @route   POST /api/complaints
// @access  User
const createComplaint = asyncHandler(async (req, res) => {
   const { title, description, category } = req.body;

   if (!title || !description || !category) {
      res.status(400);
      throw new Error("Please add all required fields");
   }

   let imageUrl = "";
   if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
   }

   // Call sentiment analysis microservice
   let sentiment = "neutral";
   let sentiment_score = 0.5;

   try {
      const sentimentRes = await axios.post("http://127.0.0.1:8000/analyze", {
         text: `${description}`,
      });
      sentiment = sentimentRes.data.sentiment;
      sentiment_score = sentimentRes.data.confidence;
   } catch (error) {
      console.log("Sentiment service failed:", error.message);
   }

   const complaint = new Complaint({
      user: req.user._id,
      title,
      description,
      image: imageUrl,
      category,
      sentiment,
      sentiment_score,
      department: req.user.department || null, // Attach department from the user object
   });

   const createdComplaint = await complaint.save();
   res.status(201).json(createdComplaint);
});

const getDepartmentComplaints = asyncHandler(async (req, res) => {
   const userDept = req.user.department;

   if (!userDept) {
      res.status(400);
      throw new Error("Department not found in user profile!");
   }

   const complaints = await Complaint.find({ category: userDept })
      .populate("user", "full_name email mobile_no")
      .sort({ createdAt: -1 });

   res.status(200).json(complaints);
});

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Admin
const updateComplaintStatus = asyncHandler(async (req, res) => {
   const { status } = req.body;

   if (!status) {
      res.status(400);
      throw new Error("Status is required!");
   }

   const complaint = await Complaint.findById(req.params.id);
   if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found!");
   }

   complaint.status = status;
   const updatedComplaint = await complaint.save();

   res.json(updatedComplaint);
});
// Filter by status and department
const getComplaintsByStatus = asyncHandler(async (req, res) => {
   const userDept = req.user.department;
   const { status } = req.query;

   if (!status) {
      res.status(400);
      throw new Error("Status is required");
   }

   const complaints = await Complaint.find({ category: userDept, status })
      .populate("user", "full_name email")
      .sort({ createdAt: -1 });

   res.status(200).json(complaints);
});

// Fetch recent complaints for today only (2 latest)
const getTodayComplaints = asyncHandler(async (req, res) => {
   const today = new Date();
   today.setHours(0, 0, 0, 0);
   const tomorrow = new Date(today);
   tomorrow.setDate(today.getDate() + 1);

   const complaints = await Complaint.find({
      category: req.user.department,
      createdAt: { $gte: today, $lt: tomorrow }
   })
   .populate("user", "full_name email")
   .sort({ createdAt: -1 })
   .limit(2);

   res.status(200).json(complaints);
});

// Fetch complaint counts by department
const getComplaintStats = asyncHandler(async (req, res) => {
   const department = req.user.department;
   const all = await Complaint.find({ category: department });

   const stats = {
      total: all.length,
      resolved: all.filter(c => c.status === "resolved").length,
      pending: all.filter(c => c.status === "pending").length,
   };

   res.json(stats);
});


export { 
   getAllComplaints, 
   getUserComplaints, 
   createComplaint, 
   updateComplaintStatus, 
   upload,
   getDepartmentComplaints, // ✅ Add this!
   getComplaintsByStatus,
   getTodayComplaints, 
   getComplaintStats
};
