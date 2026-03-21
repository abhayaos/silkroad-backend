const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")

const {
  register,
  verifyOTP,
  resendOTP,
  login,
  updateProfile
} = require("../controllers/authController")

router.post("/register", register)
router.post("/verify-otp", verifyOTP)
router.post("/resend-otp", resendOTP)
router.post("/login", login)
router.put("/profile", authMiddleware, updateProfile)

module.exports = router