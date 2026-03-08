const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const {
    createProductValidation,
    updateProductValidation,
} = require('../validators/productValidator');
const validate = require('../middleware/validate');

/**
 * Product Routes
 * GET    /api/products      — Get all products (public, paginated)
 * GET    /api/products/:id  — Get single product (public)
 * POST   /api/products      — Create product (admin only)
 * PUT    /api/products/:id  — Update product (admin only)
 * DELETE /api/products/:id  — Delete product (admin only)
 */

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorizeAdmin, createProductValidation, validate, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProductValidation, validate, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
