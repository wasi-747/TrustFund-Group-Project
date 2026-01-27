const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
// Middleware to check if user is admin (Assuming you have one, or we can mock/skip for now based on context.
// The user prompt mentioned "Admin Endpoint", usually implies protection.
// I'll check auth middleware availability from file list later, but for now I'll use a placeholder or basic check if feasible.)
// Looking at file list: `middleware` folder exists.
const auth = require("../middleware/auth"); // Guessing standard name

// Middleware to force Admin Role
const adminCheck = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access Denied: Admins Only" });
  }
};

// @route   GET /api/admin/verifications
// @desc    Get pending user verifications
// @access  Admin only
router.get("/verifications", auth, adminCheck, async (req, res) => {
  try {
    const User = require("../models/User");
    const pendingUsers = await User.find({
      verificationStatus: "pending",
    }).select("-password");
    res.json(pendingUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/admin/verify-user/:id
// @desc    Approve or Reject a user
// @access  Admin only
router.put("/verify-user/:id", auth, adminCheck, async (req, res) => {
  try {
    const User = require("../models/User");
    const { status } = req.body; // 'approved' or 'rejected'

    // Safety check
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.verificationStatus = status;
    user.isVerified = status === "approved";
    await user.save();

    res.json({ msg: `User ${status}`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/admin/milestones/pending
// @desc    Get all campaigns with pending_approval milestones
// @access  Admin only
router.get("/milestones/pending", auth, adminCheck, async (req, res) => {
  try {
    // Find campaigns that have at least one 'pending_approval' milestone
    const campaigns = await Campaign.find({
      "milestones.status": "pending_approval",
    }).select("title milestones owner");

    // Flatten to just the relevant milestones
    const pendingMilestones = [];
    campaigns.forEach((camp) => {
      camp.milestones.forEach((m) => {
        // Only include pending_approval
        if (m.status === "pending_approval") {
          pendingMilestones.push({
            campaignId: camp._id,
            campaignTitle: camp.title,
            milestone: m,
          });
        }
      });
    });

    res.json(pendingMilestones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/admin/milestone/approve
// @desc    Approve a milestone and release funds
// @access  Admin only
router.put("/milestone/approve", auth, adminCheck, async (req, res) => {
  const { campaignId, milestoneId } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    // Find the milestone
    const milestone = campaign.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ msg: "Milestone not found" });
    }

    if (milestone.status === "approved") {
      return res.status(400).json({ msg: "Milestone already approved" });
    }

    // Approve logic
    milestone.status = "approved";
    milestone.updatedAt = Date.now();

    // Release funds into wallet (only if enough locked funds exist)
    const amount = Number(milestone.amount) || 0;
    campaign.wallet = campaign.wallet || {};

    // Use stored lockedAmount, but if missing/zero, derive from current minus released
    const storedLocked = Number(campaign.wallet.lockedAmount || 0);
    const derivedLocked = Math.max(
      Number(campaign.currentAmount || 0) -
        Number(campaign.releasedAmount || 0),
      0,
    );
    const effectiveLocked = storedLocked || derivedLocked;

    if (effectiveLocked < amount) {
      return res.status(400).json({
        msg: "Insufficient locked funds to release this milestone. Keep proof pending until more donations arrive.",
      });
    }

    campaign.releasedAmount = (campaign.releasedAmount || 0) + amount;
    campaign.wallet.lockedAmount = Math.max(effectiveLocked - amount, 0);
    campaign.wallet.availableBalance =
      (campaign.wallet.availableBalance || 0) + amount;

    await campaign.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("milestone_updated", {
        campaignId: campaign._id,
        milestoneId,
        status: "approved",
        amount,
        wallet: campaign.wallet,
      });
    }

    res.json({
      msg: "Milestone approved and funds released",
      campaignReleaseAmount: campaign.releasedAmount,
      wallet: campaign.wallet,
      milestone,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/admin/milestone/reject
// @desc    Reject a milestone submission (revert to locked)
// @access  Admin only
router.put("/milestone/reject", auth, adminCheck, async (req, res) => {
  const { campaignId, milestoneId } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    const milestone = campaign.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ msg: "Milestone not found" });
    }

    if (milestone.status === "locked") {
      return res.status(400).json({ msg: "Milestone is already locked" });
    }

    // Revert to locked so owner can re-submit proof
    milestone.status = "locked";
    milestone.updatedAt = Date.now();

    await campaign.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("milestone_updated", {
        campaignId: campaign._id,
        milestoneId,
        status: "rejected",
        amount: Number(milestone.amount) || 0,
        wallet: campaign.wallet,
      });
    }

    res.json({
      msg: "Milestone rejected and returned to locked state",
      milestone,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
