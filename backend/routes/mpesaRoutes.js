const express = require('express');
const router = express.Router();
const { getMpesaToken, initiateSTKPush } = require('../services/mpesaService');

// Route to initiate STK Push
router.post('/initiate', async (req, res) => {
    try {
        const { phoneNumber, amount } = req.body;

        if (!phoneNumber || !amount) {
            return res.status(400).json({ message: 'Phone number and amount are required' });
        }

        const accessToken = await getMpesaToken();
        const response = await initiateSTKPush(phoneNumber, amount, accessToken);

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment request' });
    }
});

// Route to handle M-Pesa Callbacks
router.post('/callback', (req, res) => {
    const result = req.body.Body.stkCallback;

    if (result.ResultCode === 0) {
        console.log('Payment successful:', result);
        // Update database or trigger smart contract here
    } else {
        console.error('Payment failed:', result);
    }

    res.status(200).send('Callback received');
});

module.exports = router;