/* ==========================================================================
   NovaCart — product-details.js
   Reads a product id from the URL (product-details.html?id=5) and renders
   that product's full details, plus a quantity selector and Add to Cart.
   ========================================================================== */

let currentQty = 1;
let currentProduct = null;

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("detailsContainer");
    if (!container) {
        return; // Not on the product details page
    }

    currentProduct = getProductFromURL();

    if (!currentProduct) {
        renderProductNotFound();
        return;
    }

    renderProductDetails(currentProduct);
    setupQuantityControls();
    setupAddToCart();
});

/**
 * getProductFromURL()
 * Purpose: read the "id" query parameter from the page URL and look up the
 *          matching product.
 * Input: none
 * Output: product object, or undefined if not found / invalid
 */
function getProductFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    if (!id) {
        return undefined;
    }
    return getProductById(id);
}

/**
 * renderProductDetails(product)
 * Purpose: fill in the details page with the given product's information.
 * Input: product (object)
 * Output: none
 */
function renderProductDetails(product) {
    const discount = calculateDiscount(product);
    const categoryClass = "cat-" + product.category.toLowerCase();

    document.title = product.name + " — NovaCart";

    document.getElementById("detailsVisual").className = "details-visual " + categoryClass;
    document.getElementById("detailsVisual").textContent = product.icon;
    document.getElementById("detailsCategory").textContent = product.category;
    document.getElementById("detailsName").textContent = product.name;
    document.getElementById("detailsStars").textContent = buildStars(product.rating);
    document.getElementById("detailsRatingValue").textContent = product.rating;
    document.getElementById("detailsPriceNow").textContent = formatPrice(product.price);
    document.getElementById("detailsDescription").textContent = product.description;

    const oldPriceEl = document.getElementById("detailsPriceOld");
    if (product.oldPrice) {
        oldPriceEl.textContent = formatPrice(product.oldPrice);
        oldPriceEl.style.display = "inline";
    } else {
        oldPriceEl.style.display = "none";
    }

    const discountEl = document.getElementById("detailsDiscount");
    if (discount > 0) {
        discountEl.textContent = discount + "% OFF";
        discountEl.style.display = "inline-block";
    } else {
        discountEl.style.display = "none";
    }
}

/**
 * renderProductNotFound()
 * Purpose: show a friendly message when the id in the URL doesn't match
 *          any product (e.g. a broken link or invalid id).
 * Input: none
 * Output: none
 */
function renderProductNotFound() {
    const container = document.getElementById("detailsContainer");
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>Product not found.</h3>
            <p>The product you're looking for doesn't exist or may have been removed.</p>
            <a class="btn btn-primary" href="products.html">Browse Products</a>
        </div>
    `;
}

/**
 * setupQuantityControls()
 * Purpose: wire up the + / - quantity buttons on the details page.
 * Input: none
 * Output: none
 */
function setupQuantityControls() {
    const qtyValue = document.getElementById("qtyValue");
    const decreaseBtn = document.getElementById("qtyDecrease");
    const increaseBtn = document.getElementById("qtyIncrease");

    decreaseBtn.addEventListener("click", function () {
        if (currentQty > 1) {
            currentQty--;
            qtyValue.textContent = currentQty;
        }
    });

    increaseBtn.addEventListener("click", function () {
        currentQty++;
        qtyValue.textContent = currentQty;
    });
}

/**
 * setupAddToCart()
 * Purpose: wire up the "Add to Cart" button on the details page, using the
 *          quantity currently selected.
 * Input: none
 * Output: none
 */
function setupAddToCart() {
    const addBtn = document.getElementById("detailsAddToCart");
    const message = document.getElementById("addToCartMsg");

    addBtn.addEventListener("click", function () {
        addToCart(currentProduct.id, currentQty);
        message.textContent = `Added ${currentQty} × ${currentProduct.name} to your cart.`;
        showToast("Added to cart");
    });
}
