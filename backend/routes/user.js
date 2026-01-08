const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const upload = require("../middleware/upload"); // Uses Cloudinary now

// 1. MASTER UPDATE ROUTE
router.put(
  "/profile-update",
  auth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ msg: "User not found" });

      // Text Fields
      if (req.body.name !== undefined) user.name = req.body.name;
      if (req.body.username !== undefined) user.username = req.body.username;
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.isPublic !== undefined)
        user.isPublic = req.body.isPublic === "true";

      // JSON Parsing Helper
      const parseJSON = (data, fallback) => {
        if (!data) return fallback;
        if (typeof data === "string") {
          try {
            return JSON.parse(data);
          } catch (e) {
            return fallback;
          }
        }
        return data;
      };

      // Complex Fields
      if (req.body.topCauses)
        user.topCauses = parseJSON(req.body.topCauses, user.topCauses);

      if (req.body.socials) {
        const incomingSocials = parseJSON(req.body.socials, {});
        user.socials = { ...user.socials, ...incomingSocials };
      }

      // ⭐ HIGHLIGHTS LOGIC
      if (req.body.highlights) {
        const incomingHighlights = parseJSON(req.body.highlights, {});
        if (incomingHighlights.pins)
          user.highlights.pins = incomingHighlights.pins;
        if (incomingHighlights.links)
          user.highlights.links = incomingHighlights.links;
      }

      // ✅ CLOUDINARY UPDATE: Image Fields
      if (req.files && req.files["avatar"]) {
        user.avatar = req.files["avatar"][0].path; // Cloudinary URL
      } else if (req.body.removeAvatar === "true") user.avatar = "";

      if (req.files && req.files["cover"]) {
        user.cover = req.files["cover"][0].path; // Cloudinary URL
      } else if (req.body.removeCover === "true") user.cover = "";

      await user.save();
      console.log("✅ Updated:", user.name);
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
