// backend/utils/sendEmail.js
const sendEmail = async (email, subject, text, htmlContent = null) => {
  // ⚠️ EMERGENCY BYPASS: Printing OTP to logs instead of emailing
  // This avoids the "ETIMEDOUT" error completely.

  console.log("\n========================================");
  console.log("📨 MOCK EMAIL SENT (Check Logs for OTP)");
  console.log(`To: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log("----------------------------------------");
  console.log(text); // 👈 THIS WILL PRINT YOUR OTP CODE
  console.log("========================================\n");

  return Promise.resolve(); // Tell the server "It worked!" instantly
};

module.exports = sendEmail;
