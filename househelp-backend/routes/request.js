const express = require('express');
const router = express.Router();
const Request = require('../requestModel');

// Endpoint to create a new request
router.post('/new', async (req, res) => {
  console.log('Request data:', req.body);  // Log the incoming request data
  try {
    // Create a new request from the incoming data
    const newRequest = new Request({
      userId: req.body.userId,
      username: req.body.username,
      phone: req.body.phone,
      address: req.body.address,
      date: req.body.date,
      time: req.body.time,
      details: req.body.details
    });

    // Save request to database
    await newRequest.save();

    // Return success response
    res.status(200).json(newRequest);
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({ message: 'Failed to create request' });
  }
});

module.exports = router;
