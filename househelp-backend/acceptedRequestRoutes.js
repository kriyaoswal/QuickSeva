// acceptedRequestRoutes.js
const express = require('express');
const router = express.Router();
const AcceptedRequest = require('./AcceptedRequest'); // Import your AcceptedRequest model

// Fetch accepted requests for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const acceptedRequests = await AcceptedRequest.find({ userId: req.params.userId });
        res.json(acceptedRequests);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching accepted requests' });
    }
});

module.exports = router;
