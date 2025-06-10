const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const TeamMember = require('../models/TeamMember');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }


    const user = new User({
      email,
      password,
      role: 'Team Member',
    });

    await user.save();
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Email not found:", email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
     

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    console.log("✅ Login success");
    let name = '';
    if (user.role === 'Team Member') {
      const teamMember = await TeamMember.findOne({ email: user.email });
      if (teamMember) {
        name = teamMember.name;
      }
    }
    res.json({ success: true, user: { _id: user._id, email: user.email, role: user.role,name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

module.exports = router;
