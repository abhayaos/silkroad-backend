const crypto = require("crypto");

const OTP_SECRET = process.env.OTP_SECRET || "dev_secret_change_me";

// create hash
exports.hashOTP = (otp) => {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(otp.toString())
    .digest("hex");
};

// compare OTP safely
exports.compareOTP = (otp, hash) => {
  const otpHash = crypto
    .createHmac("sha256", OTP_SECRET)
    .update(otp.toString())
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(otpHash),
    Buffer.from(hash)
  );
};