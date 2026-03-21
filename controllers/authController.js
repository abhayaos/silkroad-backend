const User = require("../models/User")
const Otp = require("../models/Otp")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const generateOTP = require("../utils/generateOTP")
const sendOTP = require("../utils/sendOTP")

// REGISTER
exports.register = async (req, res) => {
    try {

        const { name, email, password } = req.body

        let user = await User.findOne({ email })

        if (user) {
            return res.json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        const otp = generateOTP()
        const hashedOtp = await bcrypt.hash(otp, 10)

        await Otp.deleteMany({ email })

        await Otp.create({
            email,
            otp: hashedOtp,
            expiresAt: Date.now() + 5 * 60 * 1000
        })

        await sendOTP(email, otp)

        res.json({ message: "OTP sent" })

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


// VERIFY OTP
exports.verifyOTP = async (req, res) => {
    try {

        const { email, otp } = req.body

        const record = await Otp.findOne({ email })

        if (!record) return res.json({ message: "No OTP found" })

        if (record.expiresAt < Date.now()) {
            return res.json({ message: "OTP expired" })
        }

        const valid = await bcrypt.compare(otp, record.otp)

        if (!valid) {
            return res.json({ message: "Invalid OTP" })
        }

        await User.findOneAndUpdate({ email }, { isVerified: true })

        await Otp.deleteMany({ email })

        res.json({ message: "Verified successfully" })

    } catch (err) {
        res.status(500).json(err)
    }
}


// RESEND OTP
exports.resendOTP = async (req, res) => {
    try {

        const { email } = req.body

        const otp = generateOTP()
        const hashedOtp = await bcrypt.hash(otp, 10)

        await Otp.deleteMany({ email })

        await Otp.create({
            email,
            otp: hashedOtp,
            expiresAt: Date.now() + 5 * 60 * 1000
        })

        await sendOTP(email, otp)

        res.json({ message: "OTP resent" })

    } catch (err) {
        res.status(500).json(err)
    }
}


// LOGIN
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) return res.json({ message: "User not found" })

        if (!user.isVerified) {
            return res.json({ message: "Verify OTP first" })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.json({ message: "Wrong password" })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.json({ token, user })

    } catch (err) {
        res.status(500).json(err)
    }
}


// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { name, email } = req.body

        // Check if email already exists (but not for current user)
        const existingUser = await User.findOne({ email })
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.json({ message: "Email already in use" })
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password')

        res.json({ message: "Profile updated successfully", user: updatedUser })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error", error: err.message })
    }
}