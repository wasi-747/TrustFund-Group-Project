const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const User = require("../models/User");

// 1. CONFIGURE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        req.user.id +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 2. MASTER UPDATE ROUTE
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

      const baseUrl = `${req.protocol}://${req.get("host")}/`;

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

      // ⭐ NEW: HIGHLIGHTS LOGIC
      if (req.body.highlights) {
        const incomingHighlights = parseJSON(req.body.highlights, {});
        // Merge pins and links if they exist, otherwise keep existing
        if (incomingHighlights.pins)
          user.highlights.pins = incomingHighlights.pins;
        if (incomingHighlights.links)
          user.highlights.links = incomingHighlights.links;
      }

      // Image Fields
      if (req.files && req.files["avatar"]) {
        user.avatar = baseUrl + req.files["avatar"][0].path.replace(/\\/g, "/");
      } else if (req.body.removeAvatar === "true") user.avatar = "";

      if (req.files && req.files["cover"]) {
        user.cover = baseUrl + req.files["cover"][0].path.replace(/\\/g, "/");
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
