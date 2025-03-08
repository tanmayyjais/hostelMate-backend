import mongoose from "mongoose";

const paymentReceiptSchema = new mongoose.Schema(
   {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true }, // Student Name
      enrollment_number: { type: String, required: true }, // Enrollment Number
      id_number: { type: Number, required: true, minlength: 5, maxlength: 5 }, // 5-digit ID
      category: { type: String, required: true }, // e.g., Hostel Fees for 8th Semester
      amount: { type: String, required: true }, // Payment amount
      challan_number: { type: String, required: true }, // Unique identifier for verification
      receipt: { type: String, required: true }, // PDF file path
      status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" }, // Admin decision
   },
   { timestamps: true }
);

const PaymentReceipt = mongoose.model("PaymentReceipt", paymentReceiptSchema);

export { PaymentReceipt };
