const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, index: true },
  otp: String,
  expiresAt: {
    type: Date,
    index: { expires: 0 } // auto delete after expiry
  }
}, { timestamps: true });

module.exports = mongoose.model("Otp", otpSchema);