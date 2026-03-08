const mongoose = require('mongoose');

/**
 * Category Schema
 * Simple category model with unique name constraint.
 */
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
            maxlength: [50, 'Category name cannot exceed 50 characters'],
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
