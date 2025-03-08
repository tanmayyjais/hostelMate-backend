import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, default: "" },
   },
   { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export { Announcement };
