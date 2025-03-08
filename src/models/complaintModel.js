import mongoose from "mongoose";

const complaintSchema = mongoose.Schema(
   {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, default: "" },
      status: {
         type: String,
         enum: ["pending", "accepted", "resolved"],
         default: "pending",
      },
   },
   { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);
export { Complaint };
