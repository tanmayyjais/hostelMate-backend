import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
   let token;

   if (req.headers.authorization) {
      try {
         token = req.headers.authorization.replace(/Bearer\s+/gi, "").trim();
         console.log("🛡 Token received in header:", token);

         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         console.log("🧾 Token decoded:", decoded);

         req.user = await User.findById(decoded.id).select("-password");

         if (!req.user) {
            console.warn("❌ No user found for token:", decoded.id);
            return res.status(401).json({ message: "Unauthorized: User not found" });
         }

         console.log("✅ Authenticated user:", req.user.email);
         next();
      } catch (error) {
         console.error("❌ Token verification failed:", error.message);
         return res.status(401).json({ message: "Token verification failed" });
      }
   } else {
      console.error("❌ No token found in headers");
      return res.status(401).json({ message: "No token found" });
   }
});

const admin = (req, res, next) => {
   console.log("🔍 Checking admin role for:", req.user?.email);
   if (req.user?.member_type === "academicStaff") {
      console.log("✅ Admin access granted");
      return next();
   }
   res.status(403);
   throw new Error("Not authorized as an admin");
};

// Department-specific access (e.g., electrical)
const departmentAccess = (department) => {
   return (req, res, next) => {
      console.log(`🔒 Checking ${department} access for:`, req.user?.email);
      if (
         req.user?.member_type === `${department}Staff` ||
         req.user?.member_type === "academicStaff"
      ) {
         return next();
      }
      res.status(403);
      throw new Error(`Not authorized as ${department} staff`);
   };
};

export { protect, admin, departmentAccess };
