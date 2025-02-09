const { ethers } = require('ethers');
require('dotenv').config();
const contractABI = require('../abis/SHABzPlatform.json'); // ABI of your smart contract
const contractAddress = process.env.CONTRACT_ADDRESS;

// Initialize signer and contract instance
const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_NODE_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Function to distribute tokens
async function distributeAirdrop(recipients) {
    try {
        const tx = await contract.distributeTokens(recipients.map(r => r.address), recipients.map(r => r.amount));
        await tx.wait();
        console.log('Airdrop distributed successfully:', tx.hash);
    } catch (error) {
        console.error('Error distributing airdrop:', error);
    }
}

// Function to fetch airdrop analytics
async function getAirdropAnalytics() {
    const totalDistributed = await contract.totalTokensDistributed();
    return { totalDistributed: parseInt(totalDistributed.toString()) };
}

module.exports = { distributeAirdrop, getAirdropAnalytics };