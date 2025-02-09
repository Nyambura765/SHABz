const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().sort({ points: -1 }).limit(10); // Top 10 users
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
});

module.exports = router;