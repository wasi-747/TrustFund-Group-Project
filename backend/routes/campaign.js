const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Campaign = require("../models/Campaign");
const User = require("../models/User");

// ✅ CLOUDINARY SETUP (Replaces local upload middleware)
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "campaigns",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// @route   POST /api/campaigns/create
router.post(
  "/create",
  auth,
  // ✅ Update: Use 'upload' from above, NOT '../middleware/upload'
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ msg: "User authentication failed." });
      }

      // 👇 SECURITY CHECK: VERIFICATION (Kept from your backup)
      const user = await User.findById(req.user.id);
      if (!user.isVerified) {
        return res.status(403).json({
          msg: "⛔ Access Denied. You must verify your account to create a campaign.",
        });
      }

      if (!req.files || !req.files.image) {
        return res.status(400).json({ msg: "Cover image is required" });
      }

      // ✅ FIX: Use Cloudinary URL (req.files.image[0].path)
      // instead of "http://localhost:5000/..."
      const imagePath = req.files.image[0].path;

      let videoPath = "";
      if (req.files.video) {
        videoPath = req.files.video[0].path; // Cloudinary URL for video
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

// @route   GET /api/campaigns/all
router.get("/all", async (req, res) => {
  try {
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

    if (campaign.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await campaign.deleteOne();
    res.json({ msg: "Campaign removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
