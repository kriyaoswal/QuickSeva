const express = require('express');
const User = require('../userModel'); // Adjust path as needed

const router = express.Router();

// Example route to get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error); 
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
