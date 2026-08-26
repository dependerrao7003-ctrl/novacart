/* ==========================================================================
   NovaCart — main.js
   Runs on every page: mobile navigation menu + shared toast notifications.
   Also renders the "Featured Products" section on the homepage only.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    renderFeaturedProducts();
});

/**
 * setupMobileMenu()
 * Purpose: toggle the mobile navigation open/closed when the hamburger
 *          button is clicked, and close it again after a link is tapped.
 * Input: none
 * Output: none
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.addEventListener("click", function () {
        menuToggle.classList.toggle("open");
        navLinks.classList.toggle("open");
    });

    // Close the mobile menu automatically once a link is chosen
    const links = navLinks.querySelectorAll("a");
    links.forEach(function (link) {
        link.addEventListener("click", function () {
            menuToggle.classList.remove("open");
            navLinks.classList.remove("open");
        });
    });
}

/**
 * renderFeaturedProducts()
 * Purpose: build the homepage's "Featured Products" grid dynamically from
 *          the products array, instead of hand-writing every card in HTML.
 * Input: none
 * Output: none
 */
function renderFeaturedProducts() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) {
        return; // Not on the homepage, nothing to do
    }

    // Show the first 8 products as "featured"
    const featured = products.slice(0, 8);

    grid.innerHTML = featured.map(buildProductCardHTML).join("");
}

/**
 * buildProductCardHTML(product)
 * Purpose: build the HTML string for one product card. Shared between the
 *          homepage and the products listing page.
 * Input: product (object)
 * Output: HTML string
 */
function buildProductCardHTML(product) {
    const discount = calculateDiscount(product);
    const categoryClass = "cat-" + product.category.toLowerCase();

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-visual ${categoryClass}">
                <span>${product.icon}</span>
                ${discount > 0 ? `<span class="discount-flag">${discount}% OFF</span>` : ""}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <span class="product-name">${product.name}</span>
                <span class="product-rating">
                    <span class="stars">${buildStars(product.rating)}</span> ${product.rating}
                </span>
                <div class="product-price-row">
                    <span class="price-now">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ""}
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                <a class="btn btn-outline btn-sm" href="product-details.html?id=${product.id}">View Details</a>
            </div>
        </div>
    `;
}

/**
 * showToast(message)
 * Purpose: show a small temporary notification at the bottom of the screen.
 *          Used across pages for "Added to cart", "Message sent", etc.
 * Input: message (string)
 * Output: none
 */
function showToast(message) {
    let toast = document.getElementById("toast");

    // Create the toast element once, then reuse it
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2200);
}

/**
 * Event delegation for "Add to Cart" buttons rendered dynamically.
 * Using one listener on the document avoids attaching a new listener to
 * every single card, which is a simpler pattern for beginners.
 */
document.addEventListener("click", function (event) {
    const button = event.target.closest(".add-to-cart-btn");
    if (!button) {
        return;
    }
    const productId = Number(button.dataset.id);
    addToCart(productId, 1);
    showToast("Added to cart");
});
