import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization) {
        try {
            // ✅ Extract Bearer token correctly
            token = req.headers.authorization.replace(/Bearer\s+/gi, "").trim();
            
            // ✅ Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            console.log("🔍 User Retrieved from Token:", req.user); // ✅ Debug log

            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }

            next();
        } catch (error) {
            console.error("❌ Token Verification Failed:", error.message);
            return res.status(401).json({ message: "Token verification failed" });
        }
    } else {
        console.error("❌ No token found in headers");
        return res.status(401).json({ message: "No token found" });
    }
});

// ✅ Admin middleware fix
const admin = (req, res, next) => {
    console.log("🔍 Checking Admin Role:", req.user?.member_type); // ✅ Debug log

    if (req.user && req.user.member_type === "academicStaff") {
        next();
    } else {
        res.status(403);
        throw new Error("🚫 Not authorized as an admin");
    }
};

export { protect, admin };
