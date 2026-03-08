const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const validate = require('../middleware/validate');

/**
 * Auth Routes
 * POST /api/auth/register  — Register new user
 * POST /api/auth/login     — Login user
 * POST /api/auth/refresh   — Refresh access token
 * POST /api/auth/logout    — Logout user (requires auth)
 */

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);

module.exports = router;
