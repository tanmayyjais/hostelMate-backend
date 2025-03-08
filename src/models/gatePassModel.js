import mongoose from "mongoose";

const gatePassSchema = mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      departure_date: {
         type: Date,
         required: true,
      },
      id_number: {      
         type: String,
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
      enrollment_no: {
         type: String,
         required: true,
      },
      hostel_block: {
         type: String,
         required: true,
      },
      room_no: {
         type: Number,
         required: true,
      },
      laptop_details: {
         make: { type: String, default: null },
         quantity: { type: Number, default: 0 },
      },
      baggage_details: {
         type: String,
         default: "No baggage",
      },
      status: {
         type: String,
         enum: ["pending", "approved", "rejected"],
         default: "pending",
      },
      rejectionReason: { // ✅ New Field for Rejection Message
         type: String,
         default: "",
      },
   },
   {
      timestamps: true,
   }
);

const GatePass = mongoose.model("GatePass", gatePassSchema);

export { GatePass };
