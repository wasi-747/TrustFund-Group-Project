const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
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

  // Milestone Escrow
  releasedAmount: { type: Number, default: 0 },
  withdrawnAmount: { type: Number, default: 0 }, // Legacy tracking
  wallet: {
    totalRaised: { type: Number, default: 0 },
    lockedAmount: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
  },
  milestones: [
    {
      title: { type: String, required: true },
      description: { type: String },
      amount: { type: Number, required: true },
      status: {
        type: String,
        enum: ["locked", "pending_approval", "approved"],
        default: "locked",
      },
      proofUrl: { type: String }, // NEW: Proof of Work Image
      proofDescription: { type: String }, // NEW: Description
      submittedAt: { type: Date }, // NEW: Time of submission
      updatedAt: { type: Date },
    },
  ],

  // Donation History (Transparency)
  donators: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // If logged in
      name: { type: String, default: "Anonymous" },
      amount: { type: Number, required: true },
      message: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", CampaignSchema);
