const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

/**
 * Order Routes
 *
 * User routes (require authentication):
 * POST   /api/orders      — Create a new order
 * GET    /api/orders       — Get logged-in user's orders
 * GET    /api/orders/:id   — Get single order by ID
 *
 * Admin routes are mounted separately at /api/admin/orders
 */

// All order routes require authentication
router.use(authenticate);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

module.exports = router;
