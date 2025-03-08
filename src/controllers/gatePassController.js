import asyncHandler from "express-async-handler";
import { GatePass } from "../models/gatePassModel.js";
import { User } from "../models/userModel.js";

// ✅ Request a new Gate Pass
const requestGatePass = asyncHandler(async (req, res) => {
   const { departure_date, laptop_details, baggage_details } = req.body;
   const user = await User.findById(req.user._id);

   if (!user) {
      res.status(404);
      throw new Error("User not found");
   }

   const newGatePass = await GatePass.create({
      user: user._id,
      departure_date,
      id_number: user.id_number,
      name: user.full_name,
      enrollment_no: user.enrollment_no,
      hostel_block: user.hostel_no,
      room_no: user.room_no,
      laptop_details: {
         make: laptop_details?.make || "Unknown",
         quantity: laptop_details?.quantity ? parseInt(laptop_details.quantity) : 0,
      },
      baggage_details: baggage_details || "No bags",
   });

   res.status(201).json(newGatePass);
});


// ✅ Fetch All Gate Passes for a User
const getUserGatePasses = asyncHandler(async (req, res) => {
    //console.log("🔍 Fetching Gate Passes for User:", req.user); // ✅ Debugging Log
 
    if (!req.user || !req.user._id) {
       return res.status(401).json({ message: "User not authenticated" });
    }
 
    try {
       const gatePasses = await GatePass.find({ user: req.user._id }).sort({ createdAt: -1 });
       //console.log("✅ Found Gate Passes:", gatePasses); // ✅ Debugging Log
       res.json(gatePasses);
    } catch (error) {
       console.error("❌ Error fetching gate passes:", error);
       res.status(500).json({ message: "Server error fetching gate passes" });
    }
 });
 
// ✅ Admin - Approve or Reject a Gate Pass
const updateGatePassStatus = asyncHandler(async (req, res) => {
   const { status, rejectionReason } = req.body; // ✅ Extract rejectionReason from req.body
   const gatePass = await GatePass.findById(req.params.id);

   if (!gatePass) {
      res.status(404);
      throw new Error("Gate pass not found");
   }

   gatePass.status = status;

   // ✅ Save rejection reason only if the status is "rejected"
   if (status === "rejected") {
      gatePass.rejectionReason = rejectionReason || "No reason provided";
   } else {
      gatePass.rejectionReason = ""; // ✅ Clear rejection reason if status is changed to approved
   }

   await gatePass.save();
   res.json({ message: `Gate pass ${status}` });
});


// ✅ Admin - Fetch All Gate Passes
const getAllGatePasses = asyncHandler(async (req, res) => {
    const gatePasses = await GatePass.find().populate("user", "full_name enrollment_no id_number hostel_no room_no");
    res.json(gatePasses);
 });
 
 // ✅ Existing functions remain unchanged
 export { requestGatePass, getUserGatePasses, getAllGatePasses, updateGatePassStatus };
