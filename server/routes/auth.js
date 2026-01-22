const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');
const crypto = require('crypto');

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Request OTP
router.post('/otp/request', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name: email.split('@')[0] });
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // In production, send OTP via email
    console.log(`🔐 OTP for ${email}: ${otp}`);

    res.json({ message: 'OTP sent successfully', email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP and login
router.post('/otp/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(401).json({ error: 'OTP expired' });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    user.emailVerificationTime = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      image: req.user.image
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
