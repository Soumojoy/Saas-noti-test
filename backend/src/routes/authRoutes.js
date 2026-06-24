// backend/src/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Jab koi POST request /register pe aayegi, toh register function chalega
router.post('/register', register);

// Jab koi POST request /login pe aayegi, toh login function chalega
router.post('/login', login);

module.exports = router;