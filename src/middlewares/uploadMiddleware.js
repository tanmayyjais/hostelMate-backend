import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure AWS S3 Client
const s3 = new S3Client({
   region: process.env.AWS_REGION,
   credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   },
});

// ✅ Multer-S3 Storage WITH `inline` Content-Disposition
const upload = multer({
   storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      contentType: (req, file, cb) => {
         cb(null, "application/pdf"); // ✅ Force correct Content-Type
      },
      metadata: (req, file, cb) => {
         cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
         //console.log("📤 Uploading file to S3:", file.originalname);
         cb(null, `receipts/${Date.now()}-${file.originalname}`);
      },
      contentDisposition: "inline", // ✅ Ensures PDF opens in browser
   }),
   limits: { fileSize: 5 * 1024 * 1024 }, // ✅ Limit file size to 5MB
   fileFilter: (req, file, cb) => {
      //console.log("📂 Validating file:", file.mimetype);
      if (file.mimetype === "application/pdf") {
         cb(null, true);
      } else {
         cb(new Error("Only PDF files are allowed!"), false);
      }
   },
});

export default upload;
