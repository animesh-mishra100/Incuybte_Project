// backend/controllers/auth.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to sign a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Create user
    const user = await User.create({
      email,
      password,
      role,
    });
    
    // Get user data without the password
    const userData = await User.findById(user._id).select('-password');

    // Create token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check for email and password
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // 2. Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // 3. Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    
    // Get user data without the password
    const userData = await User.findById(user._id).select('-password');

    // 4. Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};