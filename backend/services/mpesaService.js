const axios = require('axios');
require('dotenv').config();

// Function to generate OAuth token
async function getMpesaToken() {
    const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {},
            {
                headers: { Authorization: `Basic ${auth}` },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating M-Pesa token:', error.response?.data || error.message);
        throw error;
    }
}

// Function to initiate STK Push
async function initiateSTKPush(phoneNumber, amount, accessToken) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -5); 
    const password = Buffer.from(
        `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber, 
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: 'SHABz Payment',
        TransactionDesc: 'Token Purchase',
    };

    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error initiating STK Push:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    getMpesaToken,
    initiateSTKPush,
};