const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../userModel');
const config = require('../config'); // Import the config file to get jwtSecret

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  const { username, password, phone, userType, address } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new user
    const newUser = new User({
      username,
      password,
      phone,
      userType,
      ...(userType === 'user' && { address }), // Include address only if userType is 'user'
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup Error:', error); // Log error details
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token using secret from config
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      config.jwtSecret,  // Use jwtSecret from config.js
      { expiresIn: '1h' }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login Error:', error); // Log error details
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
