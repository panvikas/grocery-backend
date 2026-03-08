const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

/**
 * Seed Script
 * Populates the database with sample categories, products, and an admin user.
 * Run with: npm run seed
 */

// Sample categories for a grocery app
const categories = [
    { name: 'Fruits & Vegetables' },
    { name: 'Dairy & Eggs' },
    { name: 'Bakery' },
    { name: 'Beverages' },
    { name: 'Snacks' },
    { name: 'Meat & Seafood' },
    { name: 'Frozen Foods' },
    { name: 'Pantry Staples' },
    { name: 'Personal Care' },
    { name: 'Household' },
];

/**
 * Generate sample products for each category
 * @param {Object} categoryMap - Map of category name to MongoDB ObjectId
 * @returns {Array} Array of product objects
 */
const generateProducts = (categoryMap) => [
    // Fruits & Vegetables
    {
        title: 'Fresh Organic Bananas',
        description: 'Naturally ripened organic bananas, rich in potassium and perfect for smoothies or snacking. Sourced from certified organic farms.',
        price: 2.49,
        category: categoryMap['Fruits & Vegetables'],
        images: ['/images/products/bananas.jpg'],
        stock: 150,
    },
    {
        title: 'Red Apples (1 kg)',
        description: 'Crisp and juicy red apples, hand-picked for freshness. Great for eating raw, baking, or making apple sauce.',
        price: 3.99,
        category: categoryMap['Fruits & Vegetables'],
        images: ['/images/products/red-apples.jpg'],
        stock: 120,
    },
    {
        title: 'Baby Spinach (200g)',
        description: 'Tender baby spinach leaves, pre-washed and ready to eat. Perfect for salads, smoothies, and cooking.',
        price: 2.99,
        category: categoryMap['Fruits & Vegetables'],
        images: ['/images/products/baby-spinach.jpg'],
        stock: 80,
    },
    {
        title: 'Fresh Avocados (Pack of 3)',
        description: 'Perfectly ripe Hass avocados, creamy and delicious. Rich in healthy fats, fiber, and vitamins.',
        price: 5.99,
        category: categoryMap['Fruits & Vegetables'],
        images: ['/images/products/avocados.jpg'],
        stock: 60,
    },
    {
        title: 'Organic Carrots (500g)',
        description: 'Sweet and crunchy organic carrots. Washed and ready for snacking, juicing, or cooking.',
        price: 1.99,
        category: categoryMap['Fruits & Vegetables'],
        images: ['/images/products/carrots.jpg'],
        stock: 100,
    },

    // Dairy & Eggs
    {
        title: 'Whole Milk (1 Gallon)',
        description: 'Farm-fresh whole milk, pasteurized and homogenized. Rich, creamy taste with essential calcium and vitamins.',
        price: 4.49,
        category: categoryMap['Dairy & Eggs'],
        images: ['/images/products/whole-milk.jpg'],
        stock: 90,
    },
    {
        title: 'Free-Range Eggs (Dozen)',
        description: 'Large free-range eggs from pasture-raised hens. Rich golden yolks bursting with flavor.',
        price: 5.49,
        category: categoryMap['Dairy & Eggs'],
        images: ['/images/products/eggs.jpg'],
        stock: 70,
    },
    {
        title: 'Greek Yogurt (500g)',
        description: 'Thick and creamy Greek yogurt, high in protein. Perfect plain or topped with fruit and granola.',
        price: 3.79,
        category: categoryMap['Dairy & Eggs'],
        images: ['/images/products/greek-yogurt.jpg'],
        stock: 85,
    },
    {
        title: 'Cheddar Cheese Block (400g)',
        description: 'Aged sharp cheddar cheese with a bold, tangy flavor. Great for sandwiches, burgers, and cooking.',
        price: 6.49,
        category: categoryMap['Dairy & Eggs'],
        images: ['/images/products/cheddar-cheese.jpg'],
        stock: 55,
    },
    {
        title: 'Butter (250g)',
        description: 'Premium unsalted butter made from fresh cream. Perfect for baking, cooking, and spreading.',
        price: 3.29,
        category: categoryMap['Dairy & Eggs'],
        images: ['/images/products/butter.jpg'],
        stock: 100,
    },

    // Bakery
    {
        title: 'Whole Wheat Bread',
        description: 'Freshly baked whole wheat bread, soft and hearty. Made with 100% whole wheat flour for a nutritious choice.',
        price: 3.49,
        category: categoryMap['Bakery'],
        images: ['/images/products/wheat-bread.jpg'],
        stock: 50,
    },
    {
        title: 'Croissants (Pack of 4)',
        description: 'Flaky, buttery French-style croissants baked fresh daily. Golden and crispy on the outside, soft inside.',
        price: 4.99,
        category: categoryMap['Bakery'],
        images: ['/images/products/croissants.jpg'],
        stock: 40,
    },
    {
        title: 'Multigrain Bagels (6-pack)',
        description: 'Chewy multigrain bagels loaded with seeds and grains. Toast and enjoy with cream cheese or your favorite spread.',
        price: 4.29,
        category: categoryMap['Bakery'],
        images: ['/images/products/bagels.jpg'],
        stock: 45,
    },

    // Beverages
    {
        title: 'Orange Juice (1L)',
        description: 'Freshly squeezed 100% pure orange juice. No added sugar, packed with Vitamin C and natural goodness.',
        price: 4.99,
        category: categoryMap['Beverages'],
        images: ['/images/products/orange-juice.jpg'],
        stock: 75,
    },
    {
        title: 'Sparkling Water (12-pack)',
        description: 'Refreshing naturally carbonated sparkling water. Zero calories, zero sugar — pure hydration with bubbles.',
        price: 6.99,
        category: categoryMap['Beverages'],
        images: ['/images/products/sparkling-water.jpg'],
        stock: 60,
    },
    {
        title: 'Green Tea Bags (50-pack)',
        description: 'Premium Japanese green tea bags. Delicate flavor, rich in antioxidants for a healthy daily brew.',
        price: 5.49,
        category: categoryMap['Beverages'],
        images: ['/images/products/green-tea.jpg'],
        stock: 90,
    },

    // Snacks
    {
        title: 'Mixed Nuts (300g)',
        description: 'Premium roasted and lightly salted mixed nuts — almonds, cashews, pecans, and walnuts. High-protein snack.',
        price: 7.99,
        category: categoryMap['Snacks'],
        images: ['/images/products/mixed-nuts.jpg'],
        stock: 65,
    },
    {
        title: 'Organic Granola Bars (6-pack)',
        description: 'Crunchy organic granola bars with oats, honey, and dark chocolate chips. Perfect on-the-go energy boost.',
        price: 4.49,
        category: categoryMap['Snacks'],
        images: ['/images/products/granola-bars.jpg'],
        stock: 80,
    },
    {
        title: 'Potato Chips — Sea Salt (150g)',
        description: 'Crispy thin-cut potato chips seasoned with premium sea salt. Kettle-cooked for the perfect crunch.',
        price: 2.99,
        category: categoryMap['Snacks'],
        images: ['/images/products/potato-chips.jpg'],
        stock: 100,
    },

    // Meat & Seafood
    {
        title: 'Chicken Breast (1 kg)',
        description: 'Boneless, skinless chicken breast. Lean, high-protein meat perfect for grilling, baking, or stir-frying.',
        price: 8.99,
        category: categoryMap['Meat & Seafood'],
        images: ['/images/products/chicken-breast.jpg'],
        stock: 50,
    },
    {
        title: 'Atlantic Salmon Fillets (400g)',
        description: 'Fresh Atlantic salmon fillets, rich in Omega-3 fatty acids. Sustainably sourced for premium quality.',
        price: 12.99,
        category: categoryMap['Meat & Seafood'],
        images: ['/images/products/salmon.jpg'],
        stock: 35,
    },

    // Frozen Foods
    {
        title: 'Frozen Mixed Berries (500g)',
        description: 'A blend of frozen strawberries, blueberries, raspberries, and blackberries. Picked at peak ripeness.',
        price: 5.49,
        category: categoryMap['Frozen Foods'],
        images: ['/images/products/frozen-berries.jpg'],
        stock: 70,
    },
    {
        title: 'Frozen Pizza — Margherita',
        description: 'Classic stone-baked Margherita pizza with tomato sauce, mozzarella, and fresh basil. Ready in 12 minutes.',
        price: 6.99,
        category: categoryMap['Frozen Foods'],
        images: ['/images/products/frozen-pizza.jpg'],
        stock: 45,
    },

    // Pantry Staples
    {
        title: 'Extra Virgin Olive Oil (500ml)',
        description: 'Cold-pressed extra virgin olive oil from Mediterranean olives. Rich, fruity flavor for cooking and dressings.',
        price: 8.49,
        category: categoryMap['Pantry Staples'],
        images: ['/images/products/olive-oil.jpg'],
        stock: 60,
    },
    {
        title: 'Basmati Rice (2 kg)',
        description: 'Premium aged long-grain basmati rice. Fluffy texture with aromatic fragrance — perfect with curries.',
        price: 5.99,
        category: categoryMap['Pantry Staples'],
        images: ['/images/products/basmati-rice.jpg'],
        stock: 80,
    },
    {
        title: 'Organic Pasta — Penne (500g)',
        description: 'Certified organic penne pasta made from durum wheat semolina. Holds sauce perfectly for great meals.',
        price: 2.49,
        category: categoryMap['Pantry Staples'],
        images: ['/images/products/pasta.jpg'],
        stock: 95,
    },

    // Personal Care
    {
        title: 'Natural Hand Soap (300ml)',
        description: 'Gentle organic hand soap with aloe vera and lavender. Moisturizing formula that cleans without drying.',
        price: 3.99,
        category: categoryMap['Personal Care'],
        images: ['/images/products/hand-soap.jpg'],
        stock: 70,
    },

    // Household
    {
        title: 'Eco-Friendly Dish Soap (500ml)',
        description: 'Plant-based biodegradable dish soap. Powerful grease-cutting formula, gentle on hands and the environment.',
        price: 3.49,
        category: categoryMap['Household'],
        images: ['/images/products/dish-soap.jpg'],
        stock: 85,
    },
    {
        title: 'Paper Towels (6 Rolls)',
        description: 'Premium 2-ply paper towels, super absorbent and strong when wet. Made from sustainably sourced materials.',
        price: 7.99,
        category: categoryMap['Household'],
        images: ['/images/products/paper-towels.jpg'],
        stock: 55,
    },
];

/**
 * Main seed function
 * Clears existing data and repopulates with sample data.
 */
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({}),
        ]);
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@grocery.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log(`👤 Admin user created: ${adminUser.email} (password: admin123)`);

        // Create a regular test user
        const testUser = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'user123',
            role: 'user',
        });
        console.log(`👤 Test user created: ${testUser.email} (password: user123)`);

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`📁 ${createdCategories.length} categories created`);

        // Build category name → ID map
        const categoryMap = {};
        createdCategories.forEach((cat) => {
            categoryMap[cat.name] = cat._id;
        });

        // Create products
        const products = generateProducts(categoryMap);
        const createdProducts = await Product.insertMany(products);
        console.log(`📦 ${createdProducts.length} products created`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n--- Login Credentials ---');
        console.log('Admin: admin@grocery.com / admin123');
        console.log('User:  john@example.com / user123');
        console.log('-------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedDatabase();
