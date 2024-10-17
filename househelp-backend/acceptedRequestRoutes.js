const express = require('express');
const router = express.Router();
const AcceptedRequest = require('./AcceptedRequest');

// GET route to fetch accepted requests for a specific user
router.get('/:username2', async (req, res) => {
    const { username2 } = req.params;

    try {
        const acceptedRequests = await AcceptedRequest.find({ username2 }); // Fetch requests where username2 matches
        res.status(200).json(acceptedRequests);
    } catch (error) {
        console.error('Error fetching accepted requests:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
