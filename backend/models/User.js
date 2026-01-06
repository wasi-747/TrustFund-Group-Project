const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "fundraiser", "contributor"],
    default: "contributor",
  },

  // 📸 IMAGES
  avatar: { type: String, default: "" },
  cover: { type: String, default: "" },

  // 📝 PROFILE DETAILS
  bio: { type: String, default: "" },
  topCauses: { type: [String], default: [] },
  socials: {
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    youtube: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
  },

  // ⭐ NEW: HIGHLIGHTS (Pins & Links)
  highlights: {
    pins: [
      {
        id: String,
        title: String,
        desc: String,
        link: String,
        color: { type: String, default: "bg-emerald-500" },
      },
    ],
    links: [
      {
        id: String,
        title: String,
        url: String,
      },
    ],
  },

  isPublic: { type: Boolean, default: true },

  // 🛡️ VERIFICATION
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ["none", "pending", "approved", "rejected"],
    default: "none",
  },
  verificationData: {
    nidNumber: String,
    nidImage: String,
    address: String,
    phone: String,
    submittedAt: Date,
  },

  // RESET & OTP
  otp: String,
  otpExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
