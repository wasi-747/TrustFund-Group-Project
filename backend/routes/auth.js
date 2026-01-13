const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const auth = require("../middleware/auth");

const router = express.Router();

const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

// 🔑 GITHUB STRATEGY SETUP
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "PLACEHOLDER_ID", // Needs .env
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "PLACEHOLDER_SECRET",
      callbackURL: "http://localhost:5000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          // Check if email exists
          user = await User.findOne({ email: profile.emails[0]?.value });
          if (user) {
            user.githubId = profile.id; // Link account
            await user.save();
            return done(null, user);
          }
          // Create new user
          user = new User({
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value,
            githubId: profile.id,
            role: "contributor",
            isVerified: true, // GitHub users trusted? Maybe.
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize/Deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

// Helper: Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// @route   GET /api/auth/github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// @route   GET /api/auth/github/callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // Generate JWT for Frontend
    const payload = { user: { id: req.user.id, role: req.user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        // Redirect to Frontend with Token
        res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?token=${token}`);
      }
    );
  }
);

// @route   GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 🔒 MANUAL HASHING
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "contributor",
      otp,
      otpExpires,
    });

    await user.save();

    await sendEmail(email, "Verify Your Account", `Your OTP is: ${otp}`);
    res.status(200).json({ message: "OTP sent to email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔍 Login Attempt for: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password Mismatch (Hash check failed)");
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    console.log("✅ Password Matched!");

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(email, "Login Verification", `Your Login OTP is: ${otp}`);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP Expired" });

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // 👇 THIS IS THE CRITICAL FIX: Add 'role' here!
    const payload = {
      user: {
        id: user.id,
        role: user.role, // <--- WITHOUT THIS, ADMIN ROUTE FAILS
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" }, // Set to 5 days so you stay logged in
      (err, token) => {
        if (err) throw err;
        // Sending role in JSON helps the frontend redirect,
        // but the payload above helps the AdminRoute verify access.
        res.json({ token, role: user.role });
      }
    );
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(user.email, "Reset Code", `Your code is: ${otp}`);
    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedOtp,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid OTP" });

    // 🔒 MANUAL HASHING
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password Updated!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
