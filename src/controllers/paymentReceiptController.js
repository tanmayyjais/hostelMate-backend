import asyncHandler from "express-async-handler";
import { PaymentReceipt } from "../models/paymentReceiptModel.js";

// ✅ Get all receipts (Admin only)
const getAllReceipts = asyncHandler(async (req, res) => {
   const receipts = await PaymentReceipt.find().sort({ createdAt: -1 }).populate("user", "name");
   res.json(receipts);
});

// ✅ Get user-specific receipts
const getUserReceipts = asyncHandler(async (req, res) => {
   const receipts = await PaymentReceipt.find({ user: req.user._id }).sort({ createdAt: -1 });
   res.json(receipts);
});

// ✅ Upload a new receipt (Student)
const uploadReceipt = asyncHandler(async (req, res) => {
    //console.log("📩 Received FormData:", req.body);
    //console.log("📄 Received File:", req.file || req.files);
 
    const { name, category, enrollment_number, id_number, amount, challan_number, user } = req.body;
 
    // ✅ Ensure all required fields are present
    if (!name || !category || !enrollment_number || !id_number || !amount || !challan_number || !user) {
       return res.status(400).json({ error: "All fields are required!" });
    }
 
    // ✅ Ensure file is received
    const receiptFile = req.files?.receipt?.[0]; // If using `multer().fields()`
    if (!receiptFile) {
       return res.status(400).json({ error: "Receipt file is required!" });
    }
 
    // ✅ Save the receipt to the database
    const newReceipt = new PaymentReceipt({
       user,
       name,  // ✅ Ensure name is saved
       category,
       enrollment_number,
       id_number,
       amount,
       challan_number,
       receipt: `/uploads/${receiptFile.filename}`, // Store the uploaded file path
    });
 
    const createdReceipt = await newReceipt.save();
    res.status(201).json(createdReceipt);
 });
 
 // ✅ Delete a Receipt (User Only)
const deleteReceipt = asyncHandler(async (req, res) => {
    const receipt = await PaymentReceipt.findById(req.params.id);
 
    if (!receipt) {
       return res.status(404).json({ error: "Receipt not found!" });
    }
 
    // ✅ Ensure only the owner can delete their own receipt
    if (receipt.user.toString() !== req.user._id.toString()) {
       return res.status(403).json({ error: "Unauthorized to delete this receipt!" });
    }
 
    await receipt.deleteOne();
    res.json({ message: "Payment receipt deleted successfully!" });
 });
 

// ✅ Approve/Decline a receipt (Admin)
const updateReceiptStatus = asyncHandler(async (req, res) => {
   const { status } = req.body;
   const receipt = await PaymentReceipt.findById(req.params.id);

   if (!receipt) {
      res.status(404);
      throw new Error("Receipt not found");
   }

   if (status !== "accepted" && status !== "declined") {
      res.status(400);
      throw new Error("Invalid status update");
   }

   receipt.status = status;
   const updatedReceipt = await receipt.save(); // ✅ Fix: Return updated receipt
   res.json(updatedReceipt);
});

export { getAllReceipts, getUserReceipts, uploadReceipt, deleteReceipt ,updateReceiptStatus };
