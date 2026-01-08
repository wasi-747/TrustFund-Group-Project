const nodemailer = require("nodemailer");

// Updated to accept HTML content optionally
const sendEmail = async (email, subject, text, htmlContent = null) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // 👈 Explicitly set Gmail host
      port: 465, // 👈 CHANGE: Port 465 is crucial for Render
      secure: true, // 👈 CHANGE: true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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

    // Attempt to send
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${email}`);
  } catch (error) {
    // 🛡️ SAFETY NET: This catch block prevents the server from crashing.
    // Even if email fails, the code will continue running.
    console.error("❌ Email not sent:", error);
  }
};

module.exports = sendEmail;
