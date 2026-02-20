const express = require('express');
const router = express.Router();
const { register, login, checkBalance, logout, getMe } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/balance', verifyToken, checkBalance);
router.get('/me', verifyToken, getMe);

module.exports = router;
