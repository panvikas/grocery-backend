const orderService = require('../services/orderService');

/**
 * Order Controller
 * Thin controller layer that delegates to the order service.
 */

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (authenticated users)
const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.user._id, req.body);

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
    try {
        const result = await orderService.getUserOrders(req.user._id, req.query);

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (owner or admin)
const getOrderById = async (req, res, next) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const order = await orderService.getOrderById(
            req.params.id,
            req.user._id,
            isAdmin
        );

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Admin only
const getAllOrders = async (req, res, next) => {
    try {
        const result = await orderService.getAllOrders(req.query);

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/admin/orders/:id
// @access  Admin only
const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};
