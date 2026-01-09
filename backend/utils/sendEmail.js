const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text, htmlContent = null) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // 👈 CHANGE: Switched to 587 (TLS)
      secure: false, // 👈 CHANGE: Must be false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      family: 4, // 👈 KEEP THIS: Still forces IPv4
    });

    const mailOptions = {
      from: `"TrustFund Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text,
    };

    if (htmlContent) {
      mailOptions.html = htmlContent;
    }

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Email not sent:", error);
    // Note: We don't throw the error so the login flow doesn't crash
  }
};

module.exports = sendEmail;
