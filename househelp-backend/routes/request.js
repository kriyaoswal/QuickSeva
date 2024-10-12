const express = require('express');
const router = express.Router();
const Request = require('../requestModel');
const User = require('../userModel');

// Route to create a new request
router.post('/request-maid', async (req, res) => {
  const { userId, maidUsernames, requestTime } = req.body;

  try {
    // Create a new request
    const newRequest = new Request({ userId, maidUsernames, requestTime });
    await newRequest.save();

    // Emit the request to all connected maids
    maidUsernames.forEach(maidUsername => {
      const socketId = req.app.get('io').sockets[maidSockets[maidUsername]];
      if (socketId) {
        req.app.get('io').to(socketId).emit('newRequest', newRequest);
      }
    });

    res.status(201).json({ message: 'Request sent successfully', request: newRequest });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to accept a request
router.post('/accept-request', async (req, res) => {
  const { requestId, maidUsername } = req.body;

  try {
    // Find the request and update its status to 'accepted'
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'accepted';
    await request.save();

    res.status(200).json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to reject a request
router.post('/reject-request', async (req, res) => {
  const { requestId, maidUsername } = req.body;

  try {
    // Find the request and update its status to 'rejected'
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    res.status(200).json({ message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
