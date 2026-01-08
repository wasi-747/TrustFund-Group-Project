const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Campaign = require("../models/Campaign");
const User = require("../models/User");
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

      // 👇 SECURITY CHECK: VERIFICATION
      const user = await User.findById(req.user.id);
      if (!user.isVerified) {
        return res.status(403).json({
          msg: "⛔ Access Denied. You must verify your account to create a campaign.",
        });
      }

      if (!req.files || !req.files.image) {
        return res.status(400).json({ msg: "Cover image is required" });
      }

      // ✅ CLOUDINARY UPDATE: Use .path directly
      const imagePath = req.files.image[0].path;

      let videoPath = "";
      if (req.files.video) {
        videoPath = req.files.video[0].path; // ✅ Cloudinary URL
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

    // Check if user is the owner
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
