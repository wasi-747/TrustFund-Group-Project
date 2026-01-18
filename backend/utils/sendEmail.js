const nodemailer = require("nodemailer");

// Updated to accept HTML content optionally
const sendEmail = async (email, subject, text, htmlContent = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"TrustFund Support" <${process.env.EMAIL_USER}>`, // Professional Sender Name
      to: email,
      subject: subject,
      text: text, // Fallback for plain text clients
    };

    // If HTML is provided, add it to the email
    if (htmlContent) {
      mailOptions.html = htmlContent;
    }

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Email not sent:", error);
  }
};

module.exports = sendEmail;
