const { body } = require('express-validator');

/**
 * Validation rules for creating a product
 */
const createProductValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Product title is required')
        .isLength({ max: 150 })
        .withMessage('Title cannot exceed 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Product description is required')
        .isLength({ max: 2000 })
        .withMessage('Description cannot exceed 2000 characters'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    body('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array'),
];

/**
 * Validation rules for updating a product (all fields optional)
 */
const updateProductValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage('Title cannot exceed 150 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Description cannot exceed 2000 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .optional()
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    body('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array'),
];

module.exports = { createProductValidation, updateProductValidation };
