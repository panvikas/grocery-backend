const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

/**
 * Admin Order Routes
 * GET /api/admin/orders      — Get all orders (admin)
 * PUT /api/admin/orders/:id  — Update order status (admin)
 */

router.use(authenticate, authorizeAdmin);

router.get('/', getAllOrders);
router.put('/:id', updateOrderStatus);

module.exports = router;
