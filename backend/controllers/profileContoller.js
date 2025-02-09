const User = require('../models/user');

// Update user profile
exports.updateProfile = async (req, res) => {
    const { walletAddress, username, bio, avatar } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { walletAddress },
            { username, bio, avatar },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};