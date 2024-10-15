const express = require('express');
const router = express.Router();
const Request = require('../requestModel');

// Endpoint to create a new request
router.post('/new', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(200).json(newRequest);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
