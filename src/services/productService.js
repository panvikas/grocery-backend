const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');
const { buildPaginationResponse } = require('../utils/helpers');

/**
 * Product Service
 * Handles all product-related business logic including
 * pagination, search, filtering, and sorting.
 */

/**
 * Get products with pagination, search, filter, and sort
 * Supports query params: page, limit, search, category, minPrice, maxPrice, sort
 * @param {Object} query - Query parameters from request
 * @returns {Object} Paginated products with metadata
 */
const getProducts = async (query) => {
    const {
        page = 1,
        limit = 12,
        search,
        category,
        minPrice,
        maxPrice,
        sort,
    } = query;

    // Parse page and limit to integers
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10))); // Cap at 50

    // Build filter object
    const filter = {};

    // Search by title using regex (case-insensitive)
    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
        filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort) {
        switch (sort) {
            case 'price_asc':
                sortOption = { price: 1 };
                break;
            case 'price_desc':
                sortOption = { price: -1 };
                break;
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }
    }

    // Execute query with pagination
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate('category', 'name')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean(), // Use lean() for better performance (plain JS objects)
        Product.countDocuments(filter),
    ]);

    return buildPaginationResponse(products, pageNum, limitNum, total);
};

/**
 * Get a single product by ID
 * @param {string} productId - MongoDB product ID
 * @returns {Object} Product document
 */
const getProductById = async (productId) => {
    const product = await Product.findById(productId)
        .populate('category', 'name')
        .lean();

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    return product;
};

/**
 * Create a new product (Admin only)
 * @param {Object} productData - Product details
 * @returns {Object} Created product document
 */
const createProduct = async (productData) => {
    const product = await Product.create(productData);
    return product.populate('category', 'name');
};

/**
 * Update an existing product (Admin only)
 * @param {string} productId - MongoDB product ID
 * @param {Object} updateData - Fields to update
 * @returns {Object} Updated product document
 */
const updateProduct = async (productId, updateData) => {
    const product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Run validation on update
    }).populate('category', 'name');

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    return product;
};

/**
 * Delete a product (Admin only)
 * @param {string} productId - MongoDB product ID
 * @returns {Object} Deleted product document
 */
const deleteProduct = async (productId) => {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    return product;
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
