const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

/**
 * Category Routes
 * GET  /api/categories  — Get all categories (public)
 * POST /api/categories  — Create category (admin only)
 */

router.get('/', getCategories);
router.post('/', authenticate, authorizeAdmin, createCategory);

module.exports = router;
