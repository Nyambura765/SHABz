const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route for updating a user's profile
router.put('/profile', profileController.updateProfile);

module.exports = router;