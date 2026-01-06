const mongoose = require("mongoose");
<<<<<<< HEAD

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  image: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", CampaignSchema);
=======
 const CampaignSchema = new mongoose.Schema({ title: { type: String, required: true }, description: { type: String, required: true }, targetAmount: { type: Number, required: true }, currentAmount: { type: Number, default: 0 }, image: { type: String, required: true }, owner:
 { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, }, createdAt: { type: Date, default: Date.now }, }); module.exports = mongoose.model("Campaign", CampaignSchema);
>>>>>>> edc5603f128b58ed2653374d21d402b2cbd53632
