const express = require('express');
const User = require('../userModel'); // Adjust path as needed

const router = express.Router();

// Route to get user info by ID
router.get('/:_Id', async (req, res) => {
  try {
    const user = await User.findById(req.params._Id); // Changed to userId
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
