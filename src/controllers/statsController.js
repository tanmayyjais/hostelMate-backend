// controllers/statsController.js
import {Complaint} from "../models/complaintModel.js";
import asyncHandler from "express-async-handler";
import moment from "moment";

export const getComplaintStats = asyncHandler(async (req, res) => {
  const { range } = req.query;

  let startDate;
  if (range === "week") {
    startDate = moment().subtract(7, "days").toDate();
  } else if (range === "month") {
    startDate = moment().startOf("month").toDate();
  } else if (range === "3months") {
    startDate = moment().subtract(3, "months").startOf("month").toDate();
  } else {
    return res.status(400).json({ error: "Invalid range" });
  }

  const data = await Complaint.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          week: { $week: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 }
    }
  ]);

  res.json(data);
});
