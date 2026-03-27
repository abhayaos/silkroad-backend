const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  try {
    console.log("📨 Sending OTP to:", email);
    console.log("🔑 Using EMAIL_USER:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // TEST CONNECTION FIRST (IMPORTANT)
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"Auth System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <h1>${otp}</h1>
        <p>Expires in 5 minutes</p>
      `,
    });

    console.log("📧 EMAIL SENT:", info.messageId);

    return info;
  } catch (err) {
    console.log("❌ EMAIL ERROR FULL:", err);
    throw err;
  }
};

module.exports = sendOTP;