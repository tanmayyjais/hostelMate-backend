import express from "express";
import { connectDb } from "./config/dbConfig.js";
import { authRouter as authRoutes } from "./routes/authRoutes.js";
import { complaintRouter as complaintRoutes } from "./routes/complaintRoutes.js";
import { announcementRouter } from "./routes/announcementRoutes.js";
import roomRouter from "./routes/roomsRoutes.js";
import { paymentReceiptRouter } from "./routes/paymentReceiptRoutes.js";
import { gatePassRouter } from "./routes/gatePassRoutes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5003;

// Connect Database
connectDb();

// Middleware
app.use(cors());
app.use(express.json());

// Debug All Routes
app.use((req, res, next) => {
   console.log(`🌐 Incoming ${req.method} request to ${req.originalUrl}`);
   next();
});

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/announcements", announcementRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/payment-receipts", paymentReceiptRouter);
app.use("/api/gate-pass", gatePassRouter);

// Root
app.get("/", (req, res) => {
   res.status(200).json({ message: "Server is running successfully!" });
});

// Server Start
app.listen(PORT, () => {
   console.log(`🚀 App is listening on port ${PORT}`);
});
