const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Checks if logged in
const admin = require("../middleware/admin"); // Checks if Admin
const User = require("../models/User");

// 1. GET PENDING VERIFICATIONS
router.get("/verifications", auth, admin, async (req, res) => {
  try {
    // Find everyone waiting for approval
    const pendingUsers = await User.find({
      verificationStatus: "pending",
    }).select("name email verificationData submittedAt avatar");
    res.json(pendingUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 2. APPROVE OR REJECT USER
router.put("/verify-user/:id", auth, admin, async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update Status
    user.verificationStatus = status;

    if (status === "approved") {
      user.isVerified = true;
      user.role = "fundraiser"; // Upgrade their role so they can create campaigns
    } else {
      user.isVerified = false;
      // user.role remains 'contributor'
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
