import express from "express";
import { connectDb } from "./config/dbConfig.js";
import { authRouter as authRoutes } from "./routes/authRoutes.js";
import { complaintRouter as complaintRoutes } from "./routes/complaintRoutes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { announcementRouter } from "./routes/announcementRoutes.js";
import cors from "cors";
import roomRouter from "./routes/roomsRoutes.js";
import { paymentReceiptRouter } from "./routes/paymentReceiptRoutes.js";
import { gatePassRouter } from "./routes/gatePassRoutes.js"; // ✅ Import the new Gate Pass Router


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

connectDb();

app.get("/", (req, res) => {
   res.status(200).json({ message: "Server is running successfully!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/announcements", announcementRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/payment-receipts", paymentReceiptRouter);
app.use("/api/gate-pass", gatePassRouter); // ✅ New Route for Gate Passes


app.listen(PORT, () => {
   console.log(`App is listening on port ${PORT}`);
});
