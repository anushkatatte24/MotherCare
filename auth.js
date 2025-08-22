// In backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("./Backend/models/users"); // Make sure the path to your user model is correct

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Uses the email from your .env file
        pass: process.env.EMAIL_PASS // Uses the password from your .env file
    }
});

// --- AUTHENTICATION ROUTES ---

// @route   POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const newUser = new User({ name, email, password: hashedPassword, otp, otpExpires });
        await newUser.save();

        await transporter.sendMail({
            from: `"Mothercare App" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Your OTP for Mothercare Verification',
            text: `Welcome to Mothercare! Your One-Time Password is: ${otp}`
        });
        res.status(201).json({ message: "User created successfully. Please check your email for the OTP." });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// @route   POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired." });
        }
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Create a token immediately after verification
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: "User verified successfully!",
            token: token,
            userId: user._id
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => { // Changed from "/user" to "/login" for clarity
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials. Please try again." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials. Please try again." });
        }
        if (user.otp) { // Check if user is verified
            return res.status(403).json({ message: "Please verify your email with the OTP before logging in." });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful!",
            token: token,
            userId: user._id
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;