const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

/**
 * Authentication Middleware
 * Verifies the JWT access token from the Authorization header.
 * Attaches the user object to req.user for downstream use.
 */
const authenticate = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Access denied. No token provided.', 401);
        }

        const token = authHeader.split(' ')[1];

        // Verify the access token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Find user and attach to request
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new AppError('User not found. Token is invalid.', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        // Pass JWT-specific errors or AppErrors to the error handler
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Invalid or expired token.', 401));
    }
};

/**
 * Admin Authorization Middleware
 * Must be used AFTER the authenticate middleware.
 * Checks if the authenticated user has the 'admin' role.
 */
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    next(new AppError('Access denied. Admin privileges required.', 403));
};

module.exports = { authenticate, authorizeAdmin };
