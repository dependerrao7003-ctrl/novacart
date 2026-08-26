# NovaCart — Project Guide for Students

This guide walks you through the NovaCart codebase step by step. Read it alongside the actual files — open each file mentioned as you go.

---

## Step 1 — Understand the HTML Structure

Every page (`index.html`, `products.html`, etc.) follows the same skeleton:

```html
<header class="site-header">...navbar...</header>
<section>...page content...</section>
<footer class="site-footer">...footer...</footer>
<script src="js/products.js"></script>
<script src="js/cart.js"></script>
<script src="js/main.js"></script>
<script src="js/[page-specific].js"></script>
```

**Why this order matters:** `products.js` defines the product data, `cart.js` depends on it, `main.js` depends on both, and each page's own script (like `checkout.js`) depends on all three. Scripts run in the order they appear, so this order is required.

**Practice task:** Open `about.html` and identify which of the three "shared" scripts it includes, and which it leaves out. Why doesn't it need `checkout.js`?

---

## Step 2 — Understand the CSS Layout

Look at `css/style.css`. At the very top is a `:root` block full of CSS variables:

```css
:root {
    --primary-color: #4F46E5;
    --card-radius: 14px;
    --space-4: 16px;
}
```

Every color, spacing value, and radius in the whole project is built from these variables (e.g. `background-color: var(--primary-color)`). This means you can restyle the entire site by changing values in one place.

Layout is built with **Flexbox** (the navbar, buttons, form rows) and **CSS Grid** (the product grid, category grid, cart summary).

**Practice task:** Change `--primary-color` to a different hex value and refresh `index.html`. Notice how many elements change at once.

---

## Step 3 — Understand Product Data

Open `js/products.js`. Near the top is the `products` array:

```js
const products = [
    { id: 1, name: "Wireless Headphones", category: "Electronics", price: 2499, oldPrice: 3999, rating: 4.5, icon: "🎧", description: "..." },
    ...
];
```

This is the **entire catalog** — there is no database. Every page that shows products reads from this same array.

**Practice task:** Count how many products are in the `Beauty` category by reading the array.

---

## Step 4 — Understand JavaScript Rendering

Instead of writing 16 product cards by hand in HTML, `main.js` builds them from data:

```js
function buildProductCardHTML(product) {
    return `<div class="product-card">...${product.name}...</div>`;
}

grid.innerHTML = featured.map(buildProductCardHTML).join("");
```

Line by line:
- `buildProductCardHTML(product)` takes **one** product object and returns an HTML string for its card.
- `.map(buildProductCardHTML)` runs that function on **every** product in the array, producing an array of HTML strings.
- `.join("")` glues all those strings into one long string.
- `grid.innerHTML = ...` injects that string into the page.

**Practice task:** Find where `buildProductCardHTML` is reused on `products.html` (hint: look inside `products-page.js`).

---

## Step 5 — Understand Search

In `js/products-page.js`:

```js
searchInput.addEventListener("input", function () {
    state.searchTerm = searchInput.value.trim().toLowerCase();
    renderProducts();
});
```

Every time you type a character, the `input` event fires. The current text is saved (lowercased, so search isn't case-sensitive) and the grid is redrawn.

The actual matching happens in `getFilteredProducts()`:

```js
const matchesSearch = product.name.toLowerCase().includes(state.searchTerm);
```

**Practice task:** Search for "shirt" and then "SHIRT" — confirm both return the same result.

---

## Step 6 — Understand Filters

Category pills each carry a `data-category` attribute:

```html
<button class="category-pill" data-category="Electronics">Electronics</button>
```

Clicking one updates `state.category` and re-renders:

```js
pill.addEventListener("click", function () {
    state.category = pill.dataset.category;
    renderProducts();
});
```

**Practice task:** Click through each category pill and confirm the "Showing X Products" count updates correctly.

---

## Step 7 — Understand the Cart

The cart lives in `js/cart.js`. The core idea: the cart only stores `{ id, qty }` pairs, never full product details.

```js
function addToCart(productId, quantity) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.qty += quantity;
    } else {
        cart.push({ id: productId, qty: quantity });
    }
    saveCart(cart);
}
```

Whenever the cart needs to be displayed, the real product info (name, price, icon) is looked up fresh from `products.js` using `getProductById()`. This way, the cart is never out of sync with the catalog.

**Practice task:** Add the same product twice from two different pages (homepage and product details). Confirm the quantity adds up instead of creating two separate entries.

---

## Step 8 — Understand Local Storage

```js
function saveCart(cart) {
    localStorage.setItem("novacart_cart", JSON.stringify(cart));
}

function getCart() {
    const stored = localStorage.getItem("novacart_cart");
    return stored ? JSON.parse(stored) : [];
}
```

Local Storage only stores **strings**, so `JSON.stringify()` converts the cart array into a string to save it, and `JSON.parse()` converts it back into an array when reading it.

**Practice task:** Add a few items to your cart, then refresh the page. Open your browser's DevTools → Application → Local Storage, and find the `novacart_cart` key.

---

## Step 9 — Understand Checkout

`js/checkout.js` validates every field before allowing an order:

```js
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailPattern.test(fields.email.value.trim())) {
    showFieldError(fields.email, "Please enter a valid email address.");
    isValid = false;
}
```

A **regular expression** (the `/.../ ` pattern) checks the shape of the text. If any field fails, `isValid` becomes `false` and `event.preventDefault()` (called earlier) stops the form from "submitting," so the error messages stay visible.

**Practice task:** Try submitting the checkout form with an invalid pincode (e.g. "12AB56") and confirm the error message appears.

---

## Step 10 — Understand Event Handling

Almost every interaction in NovaCart uses `addEventListener`:

```js
menuToggle.addEventListener("click", function () {
    menuToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
});
```

For elements that are created **after** the page loads (like product cards), NovaCart uses **event delegation** — one listener on `document` that checks what was actually clicked:

```js
document.addEventListener("click", function (event) {
    const button = event.target.closest(".add-to-cart-btn");
    if (!button) return;
    addToCart(Number(button.dataset.id), 1);
});
```

**Practice task:** Resize your browser window below 768px wide and test that the hamburger menu opens and closes correctly.

---

# Practical Tasks for Students

## Beginner Tasks
- Change the website logo text.
- Change the primary color.
- Add a new product to the `products` array.
- Change a product's price.
- Add a new category.
- Change the hero heading.

## Intermediate Tasks
- Add a wishlist button (heart icon) to product cards.
- Add a product rating filter (e.g. "4 stars & up").
- Add a dark mode toggle.
- Make the cart item counter pulse briefly when it updates.
- Add a discount coupon code field on the cart page.

## Advanced Practice
*(These are exercises for you to attempt — they are not implemented in this project.)*
- Add pagination to the products page.
- Add a "Recently Viewed Products" section using Local Storage.
- Add a full wishlist page, persisted with Local Storage.
- Add an order history page, persisted with Local Storage.
