/* ==========================================================================
   NovaCart — products.js
   This file holds all product data as a single array of objects.
   Every other page/script reads from this array — it must load FIRST,
   before main.js, products-page.js, product-details.js, or cart.js.

   Note: instead of photo files, each product uses an "icon" (emoji) shown
   inside a colored card. This keeps the project fully self-contained —
   no image files are required for it to work.
   ========================================================================== */

// The full product catalog. Each product is an object with the same shape.
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        oldPrice: 3999,
        rating: 4.5,
        icon: "🎧",
        description: "Over-ear wireless headphones with 30-hour battery life, active noise cancellation, and a memory-foam headband for all-day comfort."
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        category: "Electronics",
        price: 3299,
        oldPrice: 4599,
        rating: 4.3,
        icon: "⌚",
        description: "Track steps, heart rate, sleep, and workouts. Water-resistant design with a 7-day battery and smartphone notifications."
    },
    {
        id: 3,
        name: "Portable Bluetooth Speaker",
        category: "Electronics",
        price: 1799,
        oldPrice: 2399,
        rating: 4.2,
        icon: "🔊",
        description: "Compact speaker with punchy bass, 12-hour playtime, and an IPX6 rating so it can handle rain and splashes outdoors."
    },
    {
        id: 4,
        name: "Classic Denim Jacket",
        category: "Fashion",
        price: 1999,
        oldPrice: 2999,
        rating: 4.4,
        icon: "🧥",
        description: "A timeless denim jacket with a relaxed fit, button-front closure, and durable stitching that only gets better with wear."
    },
    {
        id: 5,
        name: "Cotton Graphic T-Shirt",
        category: "Fashion",
        price: 599,
        oldPrice: 899,
        rating: 4.0,
        icon: "👕",
        description: "Soft, breathable 100% cotton t-shirt with a modern print. Machine washable and pre-shrunk for a lasting fit."
    },
    {
        id: 6,
        name: "Running Sneakers",
        category: "Fashion",
        price: 2799,
        oldPrice: 3599,
        rating: 4.6,
        icon: "👟",
        description: "Lightweight running shoes with cushioned soles and breathable mesh uppers, built for daily runs and long walks."
    },
    {
        id: 7,
        name: "Leather Wallet",
        category: "Accessories",
        price: 899,
        oldPrice: 1299,
        rating: 4.3,
        icon: "👛",
        description: "Slim genuine-leather wallet with six card slots, a coin pocket, and RFID-blocking lining to protect your cards."
    },
    {
        id: 8,
        name: "Aviator Sunglasses",
        category: "Accessories",
        price: 1299,
        oldPrice: 1899,
        rating: 4.1,
        icon: "🕶️",
        description: "Classic aviator-style sunglasses with polarized lenses and UV400 protection in a lightweight metal frame."
    },
    {
        id: 9,
        name: "Canvas Backpack",
        category: "Accessories",
        price: 1699,
        oldPrice: 2299,
        rating: 4.5,
        icon: "🎒",
        description: "A durable canvas backpack with a padded laptop sleeve, multiple compartments, and reinforced straps for daily commutes."
    },
    {
        id: 10,
        name: "Ceramic Table Lamp",
        category: "Home",
        price: 1499,
        oldPrice: 2199,
        rating: 4.2,
        icon: "💡",
        description: "A warm, minimalist ceramic table lamp that adds soft ambient light to any living room, bedroom, or study desk."
    },
    {
        id: 11,
        name: "Non-Stick Cookware Set",
        category: "Home",
        price: 2999,
        oldPrice: 3999,
        rating: 4.4,
        icon: "🍳",
        description: "A 5-piece non-stick cookware set with heat-resistant handles, ideal for everyday cooking on any stovetop."
    },
    {
        id: 12,
        name: "Aroma Diffuser",
        category: "Home",
        price: 1099,
        oldPrice: 1599,
        rating: 4.0,
        icon: "🌿",
        description: "Ultrasonic essential oil diffuser with LED mood lighting and an auto shut-off timer for safe, relaxing use."
    },
    {
        id: 13,
        name: "Vitamin C Face Serum",
        category: "Beauty",
        price: 799,
        oldPrice: 1099,
        rating: 4.5,
        icon: "🧴",
        description: "A lightweight brightening serum with Vitamin C and hyaluronic acid to even skin tone and boost hydration."
    },
    {
        id: 14,
        name: "Matte Lipstick Set",
        category: "Beauty",
        price: 999,
        oldPrice: 1499,
        rating: 4.3,
        icon: "💄",
        description: "A set of 4 long-lasting matte lipsticks in everyday shades, formulated to be lightweight and non-drying."
    },
    {
        id: 15,
        name: "Herbal Shampoo",
        category: "Beauty",
        price: 449,
        oldPrice: 649,
        rating: 4.1,
        icon: "🧴",
        description: "A sulfate-free herbal shampoo that gently cleanses while nourishing the scalp and strengthening hair strands."
    },
    {
        id: 16,
        name: "4K Action Camera",
        category: "Electronics",
        price: 4499,
        oldPrice: 5999,
        rating: 4.4,
        icon: "📷",
        description: "Waterproof 4K action camera with image stabilization, perfect for capturing adventures, sports, and travel vlogs."
    }
];

/**
 * getProductById(id)
 * Purpose: find a single product using its unique id.
 * Input: id (number)
 * Output: the matching product object, or undefined if not found.
 */
function getProductById(id) {
    // find() returns the first item that matches the condition, or undefined
    return products.find(function (product) {
        return product.id === id;
    });
}

/**
 * calculateDiscount(product)
 * Purpose: work out the discount percentage between oldPrice and price.
 * Input: a product object
 * Output: a whole number percentage (e.g. 25 for 25% off)
 */
function calculateDiscount(product) {
    if (!product.oldPrice || product.oldPrice <= product.price) {
        return 0;
    }
    const discount = ((product.oldPrice - product.price) / product.oldPrice) * 100;
    return Math.round(discount);
}

/**
 * formatPrice(amount)
 * Purpose: format a number as an Indian Rupee price string, e.g. 2499 -> "₹2,499"
 * Input: amount (number)
 * Output: formatted string
 */
function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

/**
 * buildStars(rating)
 * Purpose: turn a numeric rating (e.g. 4.5) into a simple star string.
 * Input: rating (number)
 * Output: a string of filled/empty stars, e.g. "★★★★☆"
 */
function buildStars(rating) {
    const fullStars = Math.round(rating);
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= fullStars ? "★" : "☆";
    }
    return stars;
}
