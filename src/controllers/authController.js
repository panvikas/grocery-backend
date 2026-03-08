const authService = require('../services/authService');

/**
 * Auth Controller
 * Thin controller layer that delegates business logic to the auth service.
 */

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh token)
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;
        const result = await authService.refreshToken(token);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user._id);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, refreshToken, logout };
