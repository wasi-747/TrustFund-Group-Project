const express = require("express");
const router = express.Router();
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

      console.log("📝 Creating Campaign for User:", req.user.id);
      console.log("📦 Body Keys:", Object.keys(req.body));
      if (req.body.milestones) console.log("🥅 Milestones Raw:", req.body.milestones);

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

      // 🛑 HANDLE MILESTONES (Parse JSON string if sent as FormData)
      if (req.body.milestones) {
        try {
            const milestones = JSON.parse(req.body.milestones);
            if (Array.isArray(milestones)) {
                newCampaign.milestones = milestones.map(m =>({
                    title: m.title,
                    amount: Number(m.amount),
                    description: m.description,
                    status: "locked"
                }));
            }
        } catch (e) {
            console.error("Failed to parse milestones:", e);
        }
      }

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

// @route   PUT /api/campaigns/milestone/submit-proof
router.put(
  "/milestone/submit-proof",
  auth,
  upload.single("proof"),
  async (req, res) => {
    try {
      const { campaignId, milestoneId, description } = req.body;
      const proofUrl = req.file
        ? `${process.env.SERVER_URL || "http://localhost:5000"}/uploads/${
            req.file.filename
          }`
        : req.body.proofUrl; // Fallback if just sending a link

      const campaign = await Campaign.findById(campaignId);
      if (!campaign)
        return res.status(404).json({ msg: "Campaign not found" });

      if (campaign.owner.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not authorized" });
      }

      const milestone = campaign.milestones.id(milestoneId);
      if (!milestone)
        return res.status(404).json({ msg: "Milestone not found" });

      milestone.proofUrl = proofUrl;
      milestone.proofDescription = description;
      milestone.status = "pending_approval";
      milestone.submittedAt = Date.now();

      await campaign.save();
      res.json(campaign);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }

);

// @route   POST /api/campaigns/donate/:id
// @desc    Donate to a campaign
// @access  Public (or Private)
router.post("/donate/:id", async (req, res) => {
  const { amount, name, message } = req.body;

  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    // Update amount
    // In a real app, this would happen AFTER payment gateway confirmation
    campaign.currentAmount = (campaign.currentAmount || 0) + Number(amount);

    // Add to history
    const newDonation = {
        name: name || "Anonymous",
        amount: Number(amount),
        message,
        date: new Date()
    };
    
    // Add user ID if authenticated (optional, depends on how you handle this)
    // if(req.user) newDonation.user = req.user.id;

    if (!campaign.donators) campaign.donators = [];
    campaign.donators.unshift(newDonation); // Add to top

    await campaign.save();

    // ⚡ REAL-TIME: Emit Event
    const io = req.app.get("io");
    if (io) {
      io.emit("new_donation", { 
          campaignId: campaign._id, 
          donation: newDonation 
      });
    }

    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route   POST /api/campaigns/withdraw
// @desc    Withdraw released funds (Dummy Implementation)
// @access  Private (Owner Only)
router.post("/withdraw", auth, async (req, res) => {
  const { campaignId, amount } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    if (campaign.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const withdrawAmount = Number(amount);
    if (withdrawAmount <= 0) {
      return res.status(400).json({ msg: "Amount must be positive" });
    }

    const available = (campaign.releasedAmount || 0) - (campaign.withdrawnAmount || 0);
    if (withdrawAmount > available) {
      return res.status(400).json({ msg: "Insufficient funds released for withdrawal" });
    }

    campaign.withdrawnAmount = (campaign.withdrawnAmount || 0) + withdrawAmount;
    await campaign.save();

    // ⚡ REAL-TIME: Emit Event
    const io = req.app.get("io");
    if (io) {
      io.emit("funds_withdrawn", { 
          campaignId: campaign._id, 
          amount: withdrawAmount,
          withdrawnAmount: campaign.withdrawnAmount
      });
    }

    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
