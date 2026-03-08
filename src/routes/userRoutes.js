const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, deleteUser } = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

/**
 * User Routes (Admin only)
 * GET    /api/users      — Get all users
 * GET    /api/users/:id  — Get user by ID
 * DELETE /api/users/:id  — Delete user
 */

// All user management routes require admin authentication
router.use(authenticate, authorizeAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;
