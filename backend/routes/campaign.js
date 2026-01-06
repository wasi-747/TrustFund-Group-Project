const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Config (Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// @route   POST /api/campaigns/add
// @desc    Create a new campaign with Image Upload
// @access  Private
router.post("/add", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, targetAmount } = req.body;

    // Create the full URL for the image
    const imageUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "https://via.placeholder.com/150";

    const newCampaign = new Campaign({
      title,
      description,
      targetAmount,
      image: imageUrl, // Save the localhost link
      owner: req.user.userId,
    });

    const campaign = await newCampaign.save();
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/campaigns/all
router.get("/all", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
