const Category = require('../models/Category');

/**
 * Category Controller
 * Manages product categories.
 */

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 }).lean();

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Admin only
const createCategory = async (req, res, next) => {
    try {
        const category = await Category.create({ name: req.body.name });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories, createCategory };
