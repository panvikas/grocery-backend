const Order = require('../models/Order');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');
const { buildPaginationResponse } = require('../utils/helpers');

/**
 * Order Service
 * Handles all order-related business logic.
 */

/**
 * Create a new order
 * Validates stock availability and calculates total from current product prices.
 * @param {string} userId - ID of the ordering user
 * @param {Object} orderData - { products: [{ product, quantity }], shippingAddress }
 * @returns {Object} Created order document
 */
const createOrder = async (userId, orderData) => {
    const { products: orderProducts, shippingAddress } = orderData;

    if (!orderProducts || orderProducts.length === 0) {
        throw new AppError('Order must contain at least one product', 400);
    }

    // Fetch all products and validate availability
    const productIds = orderProducts.map((item) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== productIds.length) {
        throw new AppError('One or more products not found', 404);
    }

    // Build order products with current prices and validate stock
    let totalAmount = 0;
    const orderItems = orderProducts.map((item) => {
        const dbProduct = dbProducts.find(
            (p) => p._id.toString() === item.product.toString()
        );

        if (dbProduct.stock < item.quantity) {
            throw new AppError(
                `Insufficient stock for "${dbProduct.title}". Available: ${dbProduct.stock}`,
                400
            );
        }

        const itemTotal = dbProduct.price * item.quantity;
        totalAmount += itemTotal;

        return {
            product: dbProduct._id,
            quantity: item.quantity,
            price: dbProduct.price,
        };
    });

    // Create the order
    const order = await Order.create({
        user: userId,
        products: orderItems,
        totalAmount,
        shippingAddress,
    });

    // Decrement stock for each ordered product
    await Promise.all(
        orderProducts.map((item) =>
            Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            })
        )
    );

    // Return populated order
    return Order.findById(order._id)
        .populate('user', 'name email')
        .populate('products.product', 'title price images');
};

/**
 * Get all orders for a specific user (with pagination)
 * @param {string} userId - MongoDB user ID
 * @param {Object} query - { page, limit }
 * @returns {Object} Paginated user orders
 */
const getUserOrders = async (userId, query) => {
    const { page = 1, limit = 10 } = query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
        Order.find({ user: userId })
            .populate('products.product', 'title price images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Order.countDocuments({ user: userId }),
    ]);

    return buildPaginationResponse(orders, pageNum, limitNum, total);
};

/**
 * Get a single order by ID
 * @param {string} orderId - MongoDB order ID
 * @param {string} userId - MongoDB user ID (for ownership check)
 * @param {boolean} isAdmin - Whether the requesting user is admin
 * @returns {Object} Order document
 */
const getOrderById = async (orderId, userId, isAdmin = false) => {
    const order = await Order.findById(orderId)
        .populate('user', 'name email')
        .populate('products.product', 'title price images')
        .lean();

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Only allow the order owner or admin to view the order
    if (!isAdmin && order.user._id.toString() !== userId.toString()) {
        throw new AppError('Not authorized to view this order', 403);
    }

    return order;
};

/**
 * Get all orders (Admin only, with pagination)
 * @param {Object} query - { page, limit, status }
 * @returns {Object} Paginated orders
 */
const getAllOrders = async (query) => {
    const { page = 1, limit = 10, status } = query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .populate('user', 'name email')
            .populate('products.product', 'title price images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Order.countDocuments(filter),
    ]);

    return buildPaginationResponse(orders, pageNum, limitNum, total);
};

/**
 * Update order status (Admin only)
 * @param {string} orderId - MongoDB order ID
 * @param {string} status - New status value
 * @returns {Object} Updated order document
 */
const updateOrderStatus = async (orderId, status) => {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new AppError(
            `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            400
        );
    }

    const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true, runValidators: true }
    )
        .populate('user', 'name email')
        .populate('products.product', 'title price images');

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    return order;
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};
