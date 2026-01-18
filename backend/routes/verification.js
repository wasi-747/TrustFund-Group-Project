const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // Ensure this path is correct for your upload middleware
const User = require("../models/User");

// @route   POST /api/verification/submit
// @desc    Submit verification details (NID, Phone, Address + Image)
// @access  Private
router.post("/submit", auth, upload.single("nidImage"), async (req, res) => {
  try {
    // 1. Validate File Upload
    if (!req.file) {
      return res
        .status(400)
        .json({ msg: "Please upload an image of your NID." });
    }

    const { nidNumber, phone, address } = req.body;

    // 2. Validate Text Fields
    if (!nidNumber || !phone || !address) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // 3. Find User
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ msg: "User is already verified." });
    }

    // 4. Update User Data
    user.verificationData = {
      nidNumber,
      phone,
      address,
      nidImage: `http://localhost:5000/uploads/${req.file.filename}`, // Store full URL or relative path
    };
    user.verificationStatus = "pending";
    user.submittedAt = Date.now();

    await user.save();

    res.json({ msg: "Verification submitted successfully!" });
  } catch (err) {
    console.error("Verification Submit Error:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
