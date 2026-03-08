const userService = require('../services/userService');

/**
 * User Controller
 * Admin-only user management operations.
 */

// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
const getAllUsers = async (req, res, next) => {
    try {
        const result = await userService.getAllUsers(req.query);

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin only
const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin only
const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id, req.user._id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, getUserById, deleteUser };
