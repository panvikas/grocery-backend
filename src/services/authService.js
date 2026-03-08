const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/helpers');

/**
 * Auth Service
 * Contains all authentication business logic, separated from controllers.
 */

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Object} User info and tokens
 */
const register = async ({ name, email, password }) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('User with this email already exists', 400);
    }

    // Create new user (password is hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

/**
 * Login an existing user
 * @param {Object} credentials - { email, password }
 * @returns {Object} User info and tokens
 */
const login = async ({ email, password }) => {
    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

/**
 * Refresh the access token using a valid refresh token
 * @param {string} token - Refresh token
 * @returns {Object} New access token and refresh token
 */
const refreshToken = async (token) => {
    if (!token) {
        throw new AppError('Refresh token is required', 400);
    }

    // Verify the refresh token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new AppError('Invalid or expired refresh token', 401);
    }

    // Find user and verify the stored refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
        throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens (token rotation for security)
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update stored refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};

/**
 * Logout a user by clearing their refresh token
 * @param {string} userId - MongoDB user ID
 */
const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = { register, login, refreshToken, logout };
