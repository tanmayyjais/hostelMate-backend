import mongoose from "mongoose";

// ✅ Enum for user roles
const MEMBER_TYPE_ENUM = ["student", "academicStaff"];

const userSchema = mongoose.Schema(
   {
      full_name: {
         type: String,
         required: [true, "Name is required!"],
      },
      email: {
         type: String,
         required: [true, "Email is required!"],
         unique: true,
      },
      password: {
         type: String,
         required: [true, "Password is required!"],
      },
      member_type: {
         type: String,
         enum: MEMBER_TYPE_ENUM, // ✅ Restrict member type to valid values
         required: true,
         default: "student",
      },
      mobile_no: {
         type: String,
         required: [true, "Mobile number is required!"],
      },
      gender: {
         type: String,
         required: [true, "Gender is required!"],
      },
      enrollment_no: {
         type: String, // Stores enrollment number
         required: [true, "Enrollment number is required!"],
         unique: true,
      },
      id_number: {
         type: String, // Stores unique ID number (e.g., student/staff ID)
         required: [true, "ID number is required!"],
         unique: true,
      },
      hostel_no: {
         type: String, // Stores hostel number
         default: null,
      },
      room_no: {
         type: Number, // Stores room number (should be a number, not string)
         default: null,
      },
   },
   {
      timestamps: true,
   }
);

const User = mongoose.model("User", userSchema, "users");

export { User };
