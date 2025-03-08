import asyncHandler from "express-async-handler";
import { Announcement } from "../models/announcementModel.js";

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAllAnnouncements = asyncHandler(async (req, res) => {
   const announcements = await Announcement.find().sort({ createdAt: -1 });
   res.json(announcements);
});

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Admin
const createAnnouncement = asyncHandler(async (req, res) => {
   const { title, description } = req.body;

   if (!title || !description) {
      res.status(400);
      throw new Error("All fields are required!");
   }

   const announcement = new Announcement({
      title,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : "",
   });

   const createdAnnouncement = await announcement.save();
   res.status(201).json(createdAnnouncement);
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Admin
const deleteAnnouncement = asyncHandler(async (req, res) => {
   const announcement = await Announcement.findById(req.params.id);

   if (!announcement) {
      res.status(404);
      throw new Error("Announcement not found");
   }

   await Announcement.findByIdAndDelete(req.params.id);
   res.json({ message: "Announcement removed successfully" });
});

export { getAllAnnouncements, createAnnouncement, deleteAnnouncement };
