const jwt = require('jsonwebtoken');

/**
 * Generate JWT Access Token
 * @param {string} userId - MongoDB user ID
 * @returns {string} Signed JWT access token
 */
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    });
};

/**
 * Generate JWT Refresh Token
 * @param {string} userId - MongoDB user ID
 * @returns {string} Signed JWT refresh token
 */
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });
};

/**
 * Build a standardized pagination response object
 * @param {Array} data - Array of documents
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of matching documents
 * @returns {Object} Pagination metadata
 */
const buildPaginationResponse = (data, page, limit, total) => {
    return {
        data,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        },
    };
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    buildPaginationResponse,
};
