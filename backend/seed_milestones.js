const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Campaign = require("./models/Campaign");

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Find the most recent campaign
    const campaign = await Campaign.findOne().sort({ date: -1 });

    if (!campaign) {
      console.log("❌ No campaigns found! Create one in the browser first.");
      process.exit(1);
    }

    console.log(`🎯 Found Campaign: ${campaign.title}`);

    // Add milestones
    campaign.milestones = [
      {
        title: "Medical Equipment",
        description: "Purchase of breathing apparatus",
        amount: 5000,
        status: "locked",
      },
      {
        title: "Surgery Phase 1",
        description: "Initial deposit for the hospital",
        amount: 15000,
        status: "locked",
      },
      {
        title: "Recovery Care",
        description: "Post-op medication and stay",
        amount: 5000,
        status: "locked",
      },
    ];

    await campaign.save();
    console.log("✨ Milestones Added Successfully!");
    console.log("👉 Go to Admin Dashboard to approve them.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
