/* ==========================================================================
   NovaCart — cart.js
   Shared shopping-cart logic, used on every page (navbar count, product
   details "Add to Cart", the cart page itself, and checkout).

   The cart is stored in Local Storage as a simple array of objects:
   [ { id: 1, qty: 2 }, { id: 4, qty: 1 } ]
   Only the product id and quantity are stored — full product details
   (name, price, image) are always looked up fresh from products.js.
   This keeps the stored data small and always in sync with the catalog.
   ========================================================================== */

const CART_STORAGE_KEY = "novacart_cart";

/**
 * getCart()
 * Purpose: read the current cart from Local Storage.
 * Input: none
 * Output: an array of { id, qty } objects (empty array if nothing stored)
 */
function getCart() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
        return [];
    }
    try {
        return JSON.parse(stored);
    } catch (error) {
        // If the stored data is corrupted for any reason, start fresh
        console.error("Could not read cart data, resetting cart.", error);
        return [];
    }
}

/**
 * saveCart(cart)
 * Purpose: write the cart array back to Local Storage.
 * Input: cart (array of { id, qty })
 * Output: none (also refreshes the navbar cart count on every page)
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

/**
 * addToCart(productId, quantity)
 * Purpose: add a product to the cart, or increase its quantity if it is
 *          already there.
 * Input: productId (number), quantity (number, defaults to 1)
 * Output: none
 */
function addToCart(productId, quantity) {
    quantity = quantity || 1;
    const cart = getCart();

    // Check if this product is already in the cart
    const existingItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.qty += quantity;
    } else {
        cart.push({ id: productId, qty: quantity });
    }

    saveCart(cart);
}

/**
 * removeFromCart(productId)
 * Purpose: remove a product from the cart completely.
 * Input: productId (number)
 * Output: none
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(function (item) {
        return item.id !== productId;
    });
    saveCart(cart);
}

/**
 * updateQuantity(productId, newQty)
 * Purpose: set a cart item to a specific quantity. Removes the item if the
 *          quantity drops to 0 or below.
 * Input: productId (number), newQty (number)
 * Output: none
 */
function updateQuantity(productId, newQty) {
    if (newQty <= 0) {
        removeFromCart(productId);
        return;
    }
    const cart = getCart();
    const item = cart.find(function (item) {
        return item.id === productId;
    });
    if (item) {
        item.qty = newQty;
        saveCart(cart);
    }
}

/**
 * clearCart()
 * Purpose: empty the cart completely (used after a successful order).
 * Input: none
 * Output: none
 */
function clearCart() {
    saveCart([]);
}

/**
 * getCartItemCount()
 * Purpose: count the total number of items in the cart (sum of quantities).
 * Input: none
 * Output: number
 */
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce(function (total, item) {
        return total + item.qty;
    }, 0);
}

/**
 * calculateTotals()
 * Purpose: work out subtotal, shipping, discount and grand total for the
 *          current cart. Kept in one place so every page calculates the
 *          same way.
 * Input: none
 * Output: object { subtotal, shipping, discount, total, itemCount }
 */
function calculateTotals() {
    const cart = getCart();
    let subtotal = 0;
    let itemCount = 0;

    cart.forEach(function (item) {
        const product = getProductById(item.id);
        if (product) {
            subtotal += product.price * item.qty;
            itemCount += item.qty;
        }
    });

    // Simple, beginner-friendly business rules:
    // - Free shipping over ₹2,000, otherwise a flat ₹99 fee
    // - A flat ₹500 discount once the subtotal passes ₹3,000
    let shipping = 0;
    if (subtotal > 0) {
        shipping = subtotal >= 2000 ? 0 : 99;
    }
    const discount = subtotal >= 3000 ? 500 : 0;
    const total = subtotal + shipping - discount;

    return { subtotal: subtotal, shipping: shipping, discount: discount, total: total, itemCount: itemCount };
}

/**
 * updateCartCount()
 * Purpose: update the little number badge on the cart icon in the navbar.
 *          Safe to call on every page, even if the badge element is missing.
 * Input: none
 * Output: none
 */
function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    if (!countEl) {
        return;
    }
    const count = getCartItemCount();
    countEl.textContent = count;
    countEl.style.display = count > 0 ? "flex" : "none";
}

// Keep the navbar badge correct as soon as any page loads
document.addEventListener("DOMContentLoaded", updateCartCount);

/* ==========================================================================
   CART PAGE RENDERING
   The functions below only run when the page contains a #cartItems element,
   i.e. only on cart.html. They read the cart from Local Storage and turn it
   into HTML, then wire up the quantity buttons and remove buttons.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("cartItems")) {
        renderCartPage();
    }
});

/**
 * renderCartPage()
 * Purpose: draw the full cart page — item list, totals, and the empty
 *          cart message when there is nothing to show.
 * Input: none
 * Output: none
 */
function renderCartPage() {
    const cart = getCart();
    const itemsContainer = document.getElementById("cartItems");
    const emptyState = document.getElementById("cartEmptyState");
    const summary = document.getElementById("cartSummary");

    if (cart.length === 0) {
        itemsContainer.innerHTML = "";
        emptyState.style.display = "block";
        summary.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    summary.style.display = "block";

    itemsContainer.innerHTML = cart.map(function (item) {
        const product = getProductById(item.id);
        if (!product) {
            return ""; // Skip any invalid/missing product id safely
        }
        const categoryClass = "cat-" + product.category.toLowerCase();
        const subtotal = product.price * item.qty;

        return `
            <div class="cart-item" data-id="${product.id}">
                <div class="cart-item-visual ${categoryClass}">${product.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-unit">${formatPrice(product.price)} each</div>
                </div>
                <div class="qty-stepper">
                    <button type="button" class="qty-decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
                    <span class="qty-value">${item.qty}</span>
                    <button type="button" class="qty-increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
                </div>
                <div class="cart-item-subtotal">${formatPrice(subtotal)}</div>
                <button type="button" class="remove-btn" data-id="${product.id}" aria-label="Remove item">✕</button>
            </div>
        `;
    }).join("");

    renderCartTotals();
}

/**
 * renderCartTotals()
 * Purpose: update the summary card (subtotal, shipping, discount, total).
 * Input: none
 * Output: none
 */
function renderCartTotals() {
    const totals = calculateTotals();
    document.getElementById("cartSubtotal").textContent = formatPrice(totals.subtotal);
    document.getElementById("cartShipping").textContent = totals.shipping === 0 ? "Free" : formatPrice(totals.shipping);
    document.getElementById("cartDiscount").textContent = "-" + formatPrice(totals.discount);
    document.getElementById("cartTotal").textContent = formatPrice(totals.total);
}

// Event delegation: handles clicks on quantity +/-, and remove buttons,
// even though those buttons are created dynamically by renderCartPage().
document.addEventListener("click", function (event) {
    const increaseBtn = event.target.closest(".qty-increase");
    const decreaseBtn = event.target.closest(".qty-decrease");
    const removeBtn = event.target.closest(".remove-btn");

    if (increaseBtn) {
        const cart = getCart();
        const item = cart.find(function (i) { return i.id === Number(increaseBtn.dataset.id); });
        if (item) {
            updateQuantity(item.id, item.qty + 1);
            renderCartPage();
        }
    }

    if (decreaseBtn) {
        const cart = getCart();
        const item = cart.find(function (i) { return i.id === Number(decreaseBtn.dataset.id); });
        if (item) {
            updateQuantity(item.id, item.qty - 1);
            renderCartPage();
        }
    }

    if (removeBtn) {
        removeFromCart(Number(removeBtn.dataset.id));
        renderCartPage();
    }
});
