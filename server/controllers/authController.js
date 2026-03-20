const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('[AUTH] Register request received');
    console.log('[AUTH] Request body:', req.body);
    
    const { name, email, password , jobTitle, targetDomain, experienceLevel} = req.body;
    
    console.log('[AUTH] Name:', name, '| Email:', email);
    console.log('[AUTH] JobTitle:', jobTitle, '| TargetDomain:', targetDomain, '| Experience:', experienceLevel);

    // Check if user exists
    const userExists = await User.findOne({ email });
    console.log('[AUTH] User exists check:', userExists ? 'YES' : 'NO');
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    console.log('[AUTH] Creating user...');
    const user = await User.create({
      name,
      email,
      password,
      jobTitle,
      targetDomain,
      experienceLevel
    });
    console.log('[AUTH] User created successfully:', user._id);

    if (user) {
      console.log('[AUTH] Registration successful for:', user.email);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle,
        targetDomain: user.targetDomain,
        experienceLevel: user.experienceLevel,
        token: generateToken(user._id)
      });
    } else {
      console.log('[AUTH] Invalid user data - user creation failed');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('[AUTH] Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      console.log('[AUTH] Login successful for:', user.email);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle,
        targetDomain: user.targetDomain,
        experienceLevel: user.experienceLevel,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    console.log('[AUTH] getMe for user:', user.email);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      targetDomain: user.targetDomain,
      experienceLevel: user.experienceLevel,
      analysisCount: user.analysisCount,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.jobTitle = req.body.jobTitle || user.jobTitle;
      user.targetDomain = req.body.targetDomain || user.targetDomain;
      user.experienceLevel = req.body.experienceLevel || user.experienceLevel;

      console.log('[AUTH] Profile updated for:', user.email);
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        jobTitle: updatedUser.jobTitle,
        targetDomain: updatedUser.targetDomain,
        experienceLevel: updatedUser.experienceLevel,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
