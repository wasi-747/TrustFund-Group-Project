const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["Withdrawal", "Donation"], required: true },
    method: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Completed",
    },
    reference: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", TransactionSchema);
