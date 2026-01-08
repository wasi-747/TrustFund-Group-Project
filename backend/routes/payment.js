const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const { v4: uuidv4 } = require("uuid");
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const User = require("../models/User"); // 👈 Import User Model
const auth = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail"); // 👈 Import Email Helper
const router = express.Router();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = process.env.IS_LIVE === "true";

// @route   POST /api/payment/init
router.post("/init", auth, async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    // 🛑 BACKEND SECURITY CHECK: Minimum Donation Limit (50 BDT)
    if (parseInt(amount) < 50) {
      return res.status(400).send("Minimum donation allowed is 50 BDT");
    }

    const tran_id = uuidv4();

    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id: tran_id,
      success_url: `${process.env.SERVER_URL}/api/payment/success/${tran_id}`,
      fail_url: `${process.env.SERVER_URL}/api/payment/fail/${tran_id}`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/cancel/${tran_id}`,
      ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
      shipping_method: "Courier",
      product_name: "Donation",
      product_category: "Donation",
      product_profile: "general",
      cus_name: req.user.name || "Anonymous",
      cus_email: req.user.email || "no-email@test.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const newDonation = new Donation({
      campaignId,
      donorId: req.user.id,
      transactionId: tran_id,
      amount,
      status: "Pending",
    });
    await newDonation.save();

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      res.send({ url: apiResponse.GatewayPageURL });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Payment Init Error");
  }
});

// @route   POST /api/payment/success/:tranId
// @desc    Handle Successful Payment, BROADCAST & EMAIL
router.post("/success/:tranId", async (req, res) => {
  try {
    const tranId = req.params.tranId;

    // 1. Find donation
    const donation = await Donation.findOne({ transactionId: tranId });
    if (!donation) {
      console.error("Donation not found:", tranId);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
    }

    // 2. Update Status
    donation.status = "Paid";
    await donation.save();

    // 3. Update Campaign
    const campaign = await Campaign.findByIdAndUpdate(donation.campaignId, {
      $inc: { currentAmount: donation.amount },
    });

    console.log(`✅ Payment Successful! Added ${donation.amount} to campaign.`);

    // 4. 📧 SEND "YOU GOT MONEY" EMAIL (Async)
    try {
      // Find the owner of the campaign to get their email
      const owner = await User.findById(campaign.owner);

      if (owner && owner.email) {
        const emailSubject = `💰 New Donation: ৳${donation.amount} for "${campaign.title}"`;

        // Professional HTML Template
        const emailHTML = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
            
            <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 20px;">
              <h1 style="color: #10b981; margin: 0;">TrustFund</h1>
              <p style="color: #666; font-size: 14px; margin-top: 5px;">Empowering Change, Together.</p>
            </div>

            <h2 style="color: #333; text-align: center;">🎉 You Received a Donation!</h2>
            <p style="font-size: 16px; color: #555;">Hello <strong>${owner.name}</strong>,</p>
            <p style="font-size: 16px; color: #555;">Great news! Someone just supported your cause.</p>

            <div style="background-color: #f0fdf4; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #666;">Donation Amount</p>
              <h1 style="margin: 5px 0; font-size: 32px; color: #047857;">৳${donation.amount}</h1>
              <p style="margin: 0; font-size: 14px; color: #666;">Campaign: <strong>${campaign.title}</strong></p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">View Dashboard</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="text-align: center; font-size: 12px; color: #999;">© 2026 TrustFund Platform. All rights reserved.</p>
          </div>
        `;

        // Send Email (We pass null for 'text' to use 'html')
        sendEmail(owner.email, emailSubject, null, emailHTML);
      }
    } catch (err) {
      console.error("⚠️ Failed to send notification email:", err.message);
      // We do NOT stop the request here; the payment was still successful.
    }

    // 5. ⚡ SOCKET BROADCAST
    const io = req.app.get("io");
    if (io) {
      console.log("📡 Emitting 'donation_received' event now...");
      io.emit("donation_received", {
        campaignId: donation.campaignId.toString(),
        amount: donation.amount,
      });
    } else {
      console.error("❌ Socket.io instance NOT found in request!");
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment/success`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  }
});

// @route   POST /api/payment/fail/:tranId
router.post("/fail/:tranId", async (req, res) => {
  const tranId = req.params.tranId;
  await Donation.findOneAndUpdate(
    { transactionId: tranId },
    { status: "Failed" }
  );
  res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
});

// @route   POST /api/payment/cancel/:tranId
router.post("/cancel/:tranId", async (req, res) => {
  const tranId = req.params.tranId;
  await Donation.findOneAndUpdate(
    { transactionId: tranId },
    { status: "Cancelled" }
  );
  res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
});

// @route   GET /api/payment/my-donations
router.get("/my-donations", auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id })
      .populate("campaignId", "title image")
      .sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
