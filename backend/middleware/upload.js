const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

// 👇 HYBRID IMPORT: Handles both v4 and older versions automatically
const storageLib = require("multer-storage-cloudinary");
const CloudinaryStorage = storageLib.CloudinaryStorage || storageLib;

dotenv.config();

// 1. Configure Cloudinary Credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "trustfund_uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mkv", "webm"],
    resource_type: "auto", // Auto-detect image vs video
  },
});

// 3. Initialize Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB Limit
});

module.exports = upload;
