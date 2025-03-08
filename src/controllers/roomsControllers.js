import asyncHandler from "express-async-handler";
import { Room } from "../models/roomModel.js";
import { User } from "../models/userModel.js";

// ✅ ENUM VALUES FOR HOSTELS & FLOORS
const HOSTELS = ["HB-1", "HB-2", "HB-3", "HB-4", "HB-5", "HB-6", "HB-7", "HB-8", "HB-9", "HB-10", "Girls Hostel"];
const FLOORS = ["Ground", "First", "Second"];

// ✅ Fetch available rooms
const getAvailableRooms = asyncHandler(async (req, res) => {
   const { hostel_no, floor_no } = req.query; // ✅ Get filters from frontend

   try {
      const query = {
         isOccupied: false,  // ✅ Only fetch unoccupied rooms
         status: "available" // ✅ Ensure the room is available
      };

      if (hostel_no) query.hostel_no = hostel_no;  // ✅ Filter by hostel (if selected)
      if (floor_no) query.floor_no = floor_no;    // ✅ Filter by floor (if selected)

      //console.log("🔍 Fetching Available Rooms with Query:", query);

      const availableRooms = await Room.find(query);

      if (availableRooms.length === 0) {
         console.warn("⚠️ No available rooms found!");
         return res.status(200).json({ success: true, message: "No available rooms at the moment!", rooms: [] });
      }

      res.status(200).json({ success: true, rooms: availableRooms });
   } catch (error) {
      console.error("❌ Error fetching available rooms:", error);
      res.status(500).json({ success: false, message: "Error fetching available rooms!" });
   }
});

// ✅ Get Hostel & Floor Options (for dropdowns)
const getHostelAndFloorOptions = asyncHandler(async (req, res) => {
   try {
      res.status(200).json({
         success: true,
         hostels: HOSTELS,
         floors: FLOORS
      });
   } catch (error) {
      console.error("❌ Error fetching hostel and floor options:", error);
      res.status(500).json({ success: false, message: "Error fetching hostel and floor options!" });
   }
});

// ✅ Request a Room (Status: Pending)
const requestRoom = asyncHandler(async (req, res) => {
   //console.log("📩 Incoming Room Request:", req.body);

   const { userId, hostel_no, floor_no, room_no } = req.body;

   if (!userId || !hostel_no || !floor_no || !room_no) {
       console.error("❌ Missing Required Fields:", { userId, hostel_no, floor_no, room_no });
       return res.status(400).json({ success: false, message: "All fields are required!" });
   }

   if (typeof room_no !== "number") {
       console.error("❌ Invalid Room Number (Not a Number):", room_no);
       return res.status(400).json({ success: false, message: "Invalid room number format!" });
   }

   // ✅ Check if the room exists and is available
   const room = await Room.findOne({
       hostel_no,
       floor_no,
       room_no: Number(room_no),  // 🛑 Ensure this matches the DB format
       isOccupied: false,
       status: "available"
   });

   if (!room) {
       console.error("❌ Room does not exist or is already occupied!");
       return res.status(400).json({ success: false, message: "Room does not exist or is already occupied!" });
   }

   // ✅ Update room request status to pending
   room.allocated_to = userId;
   room.status = "pending";
   await room.save();

   console.log(`✅ Room ${room_no} in ${hostel_no} requested successfully!`);
   res.status(200).json({ success: true, message: `Room ${room_no} in ${hostel_no} requested successfully!` });
});

// ✅ Fetch all pending requests
const getPendingRequests = asyncHandler(async (req, res) => {
   try {
      const pendingRequests = await Room.find({ status: "pending" }).populate("allocated_to", "full_name email");
      res.status(200).json({ success: true, requests: pendingRequests });
   } catch (error) {
      console.error("❌ Error fetching pending requests:", error);
      res.status(500).json({ success: false, message: "Error fetching pending requests!" });
   }
});

// ✅ Approve Room Allocation
const approveRoom = asyncHandler(async (req, res) => {
   const { roomId } = req.body;

   const room = await Room.findByIdAndUpdate(
      roomId, 
      { status: "approved", isOccupied: true }, 
      { new: true }
   );

   if (!room) {
      res.status(400);
      throw new Error("Room not found or cannot be approved!");
   }

   // ✅ Update user schema to confirm allocation
   const user = await User.findById(room.allocated_to);
   if (user) {
      user.hostel_no = room.hostel_no;
      user.floor_no = room.floor_no;
      user.room_no = room.room_no;
      await user.save();
   }

   res.status(200).json({ success: true, message: `Room ${room.room_no} approved successfully!` });
});

// ✅ Reject Room Allocation
const rejectRoom = asyncHandler(async (req, res) => {
   const { roomId } = req.body;

   const room = await Room.findByIdAndUpdate(
      roomId, 
      { status: "rejected", allocated_to: null, isOccupied: false }, 
      { new: true }
   );

   if (!room) {
      res.status(400);
      throw new Error("Room not found or cannot be rejected!");
   }

   res.status(200).json({ success: true, message: `Room ${room.room_no} request rejected.` });
});

// ✅ Deallocate (Free up) a room
const deallocateRoom = asyncHandler(async (req, res) => {
   const { userId } = req.body;

   if (!userId) {
      res.status(400);
      throw new Error("User ID is required!");
   }

   // ✅ Find the user
   const user = await User.findById(userId);
   if (!user || !user.hostel_no || !user.room_no) {
      res.status(400);
      throw new Error("User does not have a room allocated!");
   }

   // ✅ Find and update the allocated room
   const room = await Room.findOneAndUpdate(
      { hostel_no: user.hostel_no, room_no: user.room_no },
      { $set: { isOccupied: false, allocated_to: null, status: "available" } },
      { new: true }
   );

   if (!room) {
      res.status(400);
      throw new Error("Room allocation data is inconsistent!");
   }

   // ✅ Remove room details from user
   user.hostel_no = null;
   user.floor_no = null;
   user.room_no = null;
   await user.save();

   res.status(200).json({ success: true, message: `Room ${room.room_no} deallocated successfully!` });
});

export { 
   getAvailableRooms, 
   getHostelAndFloorOptions, 
   requestRoom, 
   getPendingRequests, 
   approveRoom, 
   rejectRoom, 
   deallocateRoom 
};
