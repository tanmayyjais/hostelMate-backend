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
    category: {
      type: String,
      enum: ["electrical", "water", "maintenance", "security"],
      required: true,
   },
    sentiment: {
      type: String,
      enum: ["very_negative", "negative", "neutral", "positive", "very_positive"],
      default: "neutral",
    },
    sentiment_score: { type: Number }, // confidence score
  },
  { timestamps: true }
);


const Complaint = mongoose.model("Complaint", complaintSchema);
export { Complaint };
