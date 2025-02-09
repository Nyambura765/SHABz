const { ethers } = require('ethers');
require('dotenv').config();
const contractABI = require('../abis/SHABzPlatform.json'); // ABI of your smart contract
const contractAddress = process.env.CONTRACT_ADDRESS;

// Initialize provider and contract instance
const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_NODE_URL);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Database model for leaderboard
const User = require('../models/user');

// Listen for PointsEarned event
contract.on('PointsEarned', async (user, points) => {
    const walletAddress = user;
    try {
        let userData = await User.findOne({ walletAddress });
        if (!userData) {
            userData = new User({ walletAddress, points: 0 });
        }
        userData.points += parseInt(points.toString());
        await userData.save();
        console.log(`Updated points for ${walletAddress}: ${userData.points}`);
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
});

// Listen for BadgeAwarded event
contract.on('BadgeAwarded', (user, badgeName) => {
    console.log(`Badge awarded to ${user}: ${badgeName}`);
    // Optionally, update user's badges in the database
});