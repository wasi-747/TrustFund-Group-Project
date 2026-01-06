const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  // Link to the User who created the campaign
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Step 1: Location & Category
  country: { type: String, required: true, default: "Bangladesh" },
  zipCode: { type: String, required: true },
  category: { type: String, required: true },

  // Step 2: Goal & Beneficiary
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  beneficiaryType: {
    type: String,
    enum: ["myself", "someone-else", "charity"],
    default: "myself",
  },
  beneficiaryName: { type: String },

  // Step 3: Media & Story
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Cover Photo

  // Video & YouTube Link support
  video: { type: String },
  youtubeLink: { type: String },

  // Verification & Status
  isVerified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "paused", "completed", "banned"],
    default: "active",
  },

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", CampaignSchema);