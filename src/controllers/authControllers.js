import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ✅ Generate JWT Token
const generateToken = (id, member_type) => {
   return jwt.sign({ id, member_type }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ Register a new user
const userRegister = asyncHandler(async (req, res) => {
   const {
      full_name,
      email,
      password,
      member_type,
      mobile_no,
      gender,
      enrollment_no,
      id_number,
      department,
   } = req.body;

   console.log("📝 Register attempt for:", email);

   // Basic required fields
   if (!email || !password || !mobile_no || !gender || !member_type || !full_name) {
      res.status(400);
      throw new Error("All required fields must be provided!");
   }

   // Check student-specific required fields
   if (member_type === "student") {
      if (!enrollment_no || !id_number) {
         res.status(400);
         throw new Error("Enrollment number and ID number are required for students!");
      }
   }

   // Validate member type (can be expanded as needed)
   const validMemberTypes = [
      "student",
      "academicStaff",
      "electricalStaff",
      "waterStaff",
      "maintenanceStaff",
      "securityStaff",
   ];
   if (!validMemberTypes.includes(member_type)) {
      res.status(400);
      throw new Error("Invalid member type!");
   }

   // Check if user already exists
   const conditions = [
      { email },
      ...(enrollment_no ? [{ enrollment_no }] : []),
      ...(id_number ? [{ id_number }] : []),
   ];

   const userExists = await User.findOne({ $or: conditions }).exec();

   if (userExists) {
      res.status(400);
      throw new Error("User with this email, enrollment number, or ID number already exists!");
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      member_type,
      department: department || null,
      mobile_no,
      gender,
      enrollment_no: member_type === "student" ? enrollment_no : null,
      id_number: member_type === "student" ? id_number : null,
      hostel_no: null,
      room_no: null,
   });

   if (user) {
      console.log("✅ User registered successfully:", user.email);
      res.status(201).json({
         u_id: user._id,
         full_name: user.full_name,
         email: user.email,
         mobile_no: user.mobile_no,
         enrollment_no: user.enrollment_no,
         id_number: user.id_number,
         hostel_no: user.hostel_no,
         room_no: user.room_no,
         member_type: user.member_type,
      });
   } else {
      res.status(400);
      throw new Error("Something went wrong!");
   }
});

// ✅ Login an existing user
const userLogin = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   console.log("➡️ Login attempt from:", email);

   const existUser = await User.findOne({ email }).exec();
   if (!existUser) {
      console.warn("❌ Login failed: user not found:", email);
      res.status(400);
      throw new Error("User does not exist with the given email!");
   }

   const isPasswordCorrect = await bcrypt.compare(password, existUser.password);
   if (!isPasswordCorrect) {
      console.warn("❌ Login failed: incorrect password for", email);
      res.status(400);
      throw new Error("Incorrect password!");
   }

   const accessToken = generateToken(existUser._id, existUser.member_type);
   console.log("✅ Login success for:", email);

   res.status(200).json({
      token: `Bearer ${accessToken}`,
      user: {
         _id: existUser._id,
         full_name: existUser.full_name,
         email: existUser.email,
         member_type: existUser.member_type,
         mobile_no: existUser.mobile_no,
         enrollment_no: existUser.enrollment_no,
         id_number: existUser.id_number,
         hostel_no: existUser.hostel_no,
         room_no: existUser.room_no,
      },
   });
});

export { userRegister, userLogin };
