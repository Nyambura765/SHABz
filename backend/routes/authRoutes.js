const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for authenticating a user via wallet
router.post('/login', authController.authenticateUser);

module.exports = router;