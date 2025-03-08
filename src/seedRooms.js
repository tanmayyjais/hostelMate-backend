import mongoose from "mongoose";
import dotenv from "dotenv";
import { Room } from "./models/roomModel.js";
import { connectDb } from "./config/dbConfig.js";

dotenv.config();
connectDb();

const HOSTEL_ENUM = [
   "HB-1", "HB-2", "HB-3", "HB-4", "HB-5",
   "HB-6", "HB-7", "HB-8", "HB-9", "HB-10",
   "Girls Hostel"
];

const FLOOR_ENUM = ["Ground", "First", "Second"];
const ROOM_ENUM = Array.from({ length: 60 }, (_, i) => i + 1);

const seedRooms = async () => {
   try {
      await Room.deleteMany(); // ✅ Clear previous data

      let roomData = [];

      HOSTEL_ENUM.forEach((hostel) => {
         FLOOR_ENUM.forEach((floor) => {
            ROOM_ENUM.forEach((room) => {
               roomData.push({
                  hostel_no: hostel,
                  floor_no: floor,
                  room_no: room,
                  isOccupied: false,
                  allocated_to: null,
                  status: "available" // ✅ Ensure rooms start as available
               });
            });
         });
      });

      await Room.insertMany(roomData);
      console.log("✅ Rooms seeded successfully.");
      process.exit();
   } catch (error) {
      console.error("❌ Error seeding rooms:", error);
      process.exit(1);
   }
};

seedRooms();
