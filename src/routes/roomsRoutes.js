import express from "express";
import {
   getAvailableRooms,
   getHostelAndFloorOptions,
   requestRoom,
   getPendingRequests,
   approveRoom,
   rejectRoom,
   deallocateRoom
} from "../controllers/roomsControllers.js";

const router = express.Router();

// ✅ Fetch available rooms
router.get("/available", getAvailableRooms);

// ✅ Fetch hostel & floor options
router.get("/options", getHostelAndFloorOptions);

// ✅ Request a room (Pending Approval)
router.post("/request", requestRoom);

// ✅ Fetch pending room requests (Admin)
router.get("/pending", getPendingRequests);

// ✅ Approve a room request (Admin)
router.post("/approve", approveRoom);

// ✅ Reject a room request (Admin)
router.post("/reject", rejectRoom);

// ✅ Deallocate a room (Admin)
router.post("/deallocate", deallocateRoom);

export default router;
