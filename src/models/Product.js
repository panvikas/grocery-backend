const mongoose = require('mongoose');

/**
 * Product Schema
 * Stores product details with category reference and text search index.
 */
const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
            maxlength: [150, 'Title cannot exceed 150 characters'],
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        images: [
            {
                type: String, // URL or file path to the image
            },
        ],
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

// Text index for search functionality on title and description
productSchema.index({ title: 'text', description: 'text' });

// Index for efficient filtering and sorting
productSchema.index({ category: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
