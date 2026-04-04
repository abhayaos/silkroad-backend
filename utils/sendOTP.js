const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing EMAIL_USER or EMAIL_PASS");
    }

    console.log("📨 Sending OTP to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ SMTP Ready");

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

    console.log("📧 SENT:", info.messageId);
    return info;

  } catch (err) {
    console.error("❌ EMAIL ERROR:", err.message);
    throw err;
  }
};

module.exports = sendOTP;