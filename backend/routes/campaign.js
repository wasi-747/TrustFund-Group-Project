const express = require("express");
const router = express.Router();
<<<<<<< HEAD
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
=======
const auth = require("../middleware/auth");
const Campaign = require("../models/Campaign");
const User = require("../models/User"); // 👈 IMPORT USER MODEL
const upload = require("../middleware/upload");

// @route   POST /api/campaigns/create
router.post(
  "/create",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ msg: "User authentication failed." });
      }

      // 👇 NEW SECURITY CHECK: VERIFICATION
      const user = await User.findById(req.user.id);
      if (!user.isVerified) {
        return res.status(403).json({
          msg: "⛔ Access Denied. You must verify your account to create a campaign.",
        });
      }

      if (!req.files || !req.files.image) {
        return res.status(400).json({ msg: "Cover image is required" });
      }

      const imagePath =
        "http://localhost:5000/uploads/" + req.files.image[0].filename;
      let videoPath = "";
      if (req.files.video) {
        videoPath =
          "http://localhost:5000/uploads/" + req.files.video[0].filename;
      }

      const newCampaign = new Campaign({
        owner: req.user.id,
        title: req.body.title,
        description: req.body.description,
        targetAmount: req.body.targetAmount,
        category: req.body.category || "General",
        country: req.body.country,
        zipCode: req.body.zipCode,
        beneficiaryType: req.body.beneficiaryType,
        youtubeLink: req.body.youtubeLink,
        image: imagePath,
        video: videoPath,
      });

      const campaign = await newCampaign.save();
      res.json(campaign);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error: " + err.message);
    }
  }
);
>>>>>>> edc5603f128b58ed2653374d21d402b2cbd53632

// @route   GET /api/campaigns/all
router.get("/all", async (req, res) => {
  try {
<<<<<<< HEAD
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
=======
    const campaigns = await Campaign.find().sort({ date: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/campaigns/:id
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });
    res.json(campaign);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Campaign not found" });
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/campaigns/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    // Check if user is the owner
    if (campaign.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await campaign.deleteOne();
    res.json({ msg: "Campaign removed" });
  } catch (err) {
    console.error(err.message);
>>>>>>> edc5603f128b58ed2653374d21d402b2cbd53632
    res.status(500).send("Server Error");
  }
});

module.exports = router;
