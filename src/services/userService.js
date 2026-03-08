const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { buildPaginationResponse } = require('../utils/helpers');

/**
 * User Service
 * Admin-only operations for user management.
 */

/**
 * Get all users with pagination (Admin only)
 * @param {Object} query - { page, limit }
 * @returns {Object} Paginated users
 */
const getAllUsers = async (query) => {
    const { page = 1, limit = 10 } = query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
        User.find()
            .select('-refreshToken')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        User.countDocuments(),
    ]);

    return buildPaginationResponse(users, pageNum, limitNum, total);
};

/**
 * Get a single user by ID (Admin only)
 * @param {string} userId - MongoDB user ID
 * @returns {Object} User document
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-refreshToken').lean();

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};

/**
 * Delete a user (Admin only)
 * Prevents admin from deleting themselves.
 * @param {string} userId - MongoDB user ID to delete
 * @param {string} adminId - ID of the admin performing the action
 * @returns {Object} Deleted user document
 */
const deleteUser = async (userId, adminId) => {
    if (userId === adminId.toString()) {
        throw new AppError('Admin cannot delete themselves', 400);
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};

module.exports = { getAllUsers, getUserById, deleteUser };
