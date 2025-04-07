import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
   let token;

   if (req.headers.authorization) {
      try {
         token = req.headers.authorization.replace(/Bearer\s+/gi, "").trim();
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = await User.findById(decoded.id).select("-password");

         if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
         }

         next();
      } catch (error) {
         return res.status(401).json({ message: "Token verification failed" });
      }
   } else {
      return res.status(401).json({ message: "No token found" });
   }
});

const admin = (req, res, next) => {
   if (req.user?.member_type === "academicStaff") {
      return next();
   }
   res.status(403).json({ message: "Not authorized as an admin" });
};

// ✅ Universal department access middleware
const departmentAccess = (req, res, next) => {
   const allowedTypes = ["electricalStaff", "waterStaff", "maintenanceStaff", "securityStaff", "academicStaff"];
   if (allowedTypes.includes(req.user?.member_type)) {
      return next();
   }
   res.status(403).json({ message: "Not authorized as department staff" });
};

export { protect, admin, departmentAccess };
