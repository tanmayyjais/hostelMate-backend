import mongoose from "mongoose";

const MEMBER_TYPE_ENUM = [
   "student",
   "academicStaff",       // Super Admin
   "electricalStaff",
   "waterStaff",
   "maintenanceStaff",
   "securityStaff",
];

const DEPARTMENT_ENUM = ["electrical", "water", "maintenance", "security", "houskeeping", "network"];

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
         enum: MEMBER_TYPE_ENUM,
         required: true,
         default: "student",
      },
      department: {
         type: String,
         enum: DEPARTMENT_ENUM,
         default: null,
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
         type: String,
         required: function () {
           return this.member_type === "student";
         },
         unique: true,
       },
       id_number: {
         type: String,
         required: function () {
           return this.member_type === "student";
         },
         unique: true,
       },       
      hostel_no: {
         type: String,
         default: null,
      },
      room_no: {
         type: Number,
         default: null,
      },
   },
   {
      timestamps: true,
   }
);

const User = mongoose.model("User", userSchema, "users");

export { User };
