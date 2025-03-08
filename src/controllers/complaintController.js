import asyncHandler from "express-async-handler";
import { Complaint } from "../models/complaintModel.js";
import multer from "multer";
import path from "path";

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
   const { title, description } = req.body;

   if (!title || !description) {
      res.status(400);
      throw new Error("Please add all required fields");
   }

   let imageUrl = "";
   if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
   }

   const complaint = new Complaint({
      user: req.user._id,
      title,
      description,
      image: imageUrl, // ✅ Store only the filename, not the full path
   });

   const createdComplaint = await complaint.save();
   res.status(201).json(createdComplaint);
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

export { getAllComplaints, getUserComplaints, createComplaint, updateComplaintStatus, upload };