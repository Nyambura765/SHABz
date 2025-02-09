const ethers = require('ethers');
const User = require('../models/user');

// Function to verify the signature
function verifySignature(address, message, signature) {
    try {
        // Recover the signer's address from the message and signature
        const recoveredAddress = ethers.verifyMessage(message, signature);
        // Compare the recovered address with the provided address
        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
            return true; // Signature is valid
        }
    } catch (error) {
        console.error('Error verifying signature:', error);
    }
    return false; // Signature is invalid
}

exports.authenticateUser = async (req, res) => {
    const { walletAddress, message, signature } = req.body;

    if (verifySignature(walletAddress, message, signature)) {
        let user = await User.findOne({ walletAddress });
        if (!user) {
            user = new User({ walletAddress });
            await user.save();
        }
        return res.status(200).json({ message: 'Authentication successful', user });
    } else {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};