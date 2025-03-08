import mongoose from "mongoose";

// ✅ Enum for hostel numbers
const HOSTEL_ENUM = [
   "HB-1", "HB-2", "HB-3", "HB-4", "HB-5",
   "HB-6", "HB-7", "HB-8", "HB-9", "HB-10",
   "Girls Hostel"
];

// ✅ Enum for floor numbers
const FLOOR_ENUM = ["Ground", "First", "Second"];

// ✅ Enum for room numbers (Assuming each hostel floor has 60 rooms)
const ROOM_ENUM = Array.from({ length: 60 }, (_, i) => i + 1);

// ✅ Enum for Room Status
const STATUS_ENUM = ["available", "pending", "approved", "rejected"];

const roomSchema = mongoose.Schema({
   hostel_no: { type: String, enum: HOSTEL_ENUM, required: true },
   floor_no: { type: String, enum: FLOOR_ENUM, required: true },
   room_no: { type: Number, required: true },
   isOccupied: { type: Boolean, default: false },
   allocated_to: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
   status: { type: String, enum: STATUS_ENUM, default: "available" }, // ✅ Added status field
}, { unique: false });

roomSchema.index({ hostel_no: 1, floor_no: 1, room_no: 1 }, { unique: true });

const Room = mongoose.model("Room", roomSchema, "rooms");

export { Room };
