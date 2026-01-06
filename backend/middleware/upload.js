const multer = require("multer");
const path = require("path");
const fs = require("fs"); // 👇 1. Import File System

// 👇 2. Ensure 'uploads' folder exists (Prevents 500 Crash)
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 3. Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Rename: file-timestamp.ext (e.g., image-123456789.png)
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// 4. Filter: Allow Images & Videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp", // Added webp support
    "video/mp4",
    "video/mkv",
    "video/webm", // Added webm support
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only JPG, PNG, MP4, MKV allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB Limit
  fileFilter: fileFilter,
});

module.exports = upload;
