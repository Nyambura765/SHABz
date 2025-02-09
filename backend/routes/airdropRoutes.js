
const express = require('express');
const router = express.Router();
const { distributeAirdrop, getAirdropAnalytics } = require('../services/airdropService');

router.post('/distribute', async (req, res) => {
    try {
        await distributeAirdrop(req.body.recipients);
        res.json({ message: 'Airdrop distributed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error distributing airdrop' });
    }
});

router.get('/analytics', async (req, res) => {
    try {
        const analytics = await getAirdropAnalytics();
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching airdrop analytics' });
    }
});

module.exports = router;