# NovaCart — Modern Online Store

A complete, responsive e-commerce frontend built with **only HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no backend. Designed as a learning project for beginner web development students, while looking like a real, professional online store.

---

## 1. Project Overview

NovaCart is a fictional online store where a visitor can browse products across five categories, search and filter them, view full product details, manage a shopping cart, and complete a simulated checkout — all running entirely in the browser. There is no server and no database; the "backend" is a JavaScript array of product objects, and the cart is persisted using the browser's Local Storage.

---

## 2. Features

- Responsive navbar with a working mobile hamburger menu
- Hero section with call-to-action buttons
- Category browsing (Electronics, Fashion, Accessories, Home, Beauty)
- Dynamically rendered product cards (nothing is hard-coded in HTML)
- Live search by product name
- Category filtering
- Price sorting (low→high, high→low)
- Product details page with a quantity selector
- Full shopping cart: add, increase/decrease quantity, remove
- Cart totals calculated dynamically (subtotal, shipping, discount, total)
- Cart persistence using Local Storage (survives refresh and browser restarts)
- Checkout form with real JavaScript validation
- Order success screen with a randomly generated Order ID
- Contact form with validation
- About page
- Fully responsive from 360px to 1440px+
- Accessible: semantic HTML, labeled form fields, visible focus states

---

## 3. Technologies Used

- **HTML5** — semantic structure across 7 pages
- **CSS3** — Flexbox, CSS Grid, CSS Variables, media queries
- **Vanilla JavaScript (ES6)** — no libraries or frameworks
- **Local Storage** — cart persistence

---

## 4. Project Structure

```
novacart/
│
├── index.html              Homepage: hero, categories, featured products
├── products.html           Full product listing with search/filter/sort
├── product-details.html    Single product view (reads ?id= from the URL)
├── cart.html                Shopping cart page
├── checkout.html            Checkout form + order success screen
├── about.html                About NovaCart page
├── contact.html              Contact form page
│
├── css/
│   ├── style.css            Design tokens, layout, navbar, hero, product cards, footer
│   ├── components.css       Forms, cart table, checkout, details page, about, contact
│   └── responsive.css       All media queries (1024 / 768 / 480 / 360px)
│
├── js/
│   ├── products.js          The product data array + small helper functions
│   ├── main.js               Mobile menu, homepage featured products, toast messages
│   ├── products-page.js      Search, filter and sort logic for products.html
│   ├── product-details.js    Reads the product id from the URL and renders it
│   ├── cart.js                All cart logic (Local Storage) + cart page rendering
│   ├── checkout.js            Order summary, form validation, order placement
│   └── contact.js             Contact form validation
│
├── assets/                  Present for structure; icons are emoji-based (no image files needed)
│
├── README.md                 This file
├── PROJECT_GUIDE.md          Step-by-step learning guide for students
└── PROJECT_SETUP.md          Exact steps to run the project
```

> **Note on images:** instead of photo files, every product is represented by a colored card and an emoji icon (defined in `products.js`). This keeps the whole project self-contained — it works immediately with no missing images, and it's simple for students to swap in real photos later (see PROJECT_GUIDE.md).

---

## 5. How to Run

1. Download or copy the `novacart` folder to your computer.
2. Open the folder.
3. Double-click `index.html` — it will open in your default browser. That's it.

**Using VS Code Live Server (optional, recommended):**
1. Open the `novacart` folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` → **Open with Live Server**.
4. The site opens at `http://127.0.0.1:5500/index.html` and auto-reloads when you edit files.

No installation, build step, or internet connection is required for the site to function (an internet connection is only used to load the Google Fonts).

---

## 6. Features Explained

**Search** — Typing in the search box on `products.html` filters the product grid live, matching the text against each product's name.

**Filter** — Category pills (All / Electronics / Fashion / Accessories / Home / Beauty) narrow the grid to one category at a time.

**Sorting** — A dropdown re-sorts the currently filtered products by price, low-to-high or high-to-low, without changing the search or category filter.

**Product Details** — Clicking "View Details" navigates to `product-details.html?id=X`. JavaScript reads `X` from the URL and looks up the matching product to render.

**Cart** — Adding a product stores `{ id, qty }` in Local Storage. The cart page reads this, looks up full product info fresh from `products.js`, and renders the table and totals.

**Local Storage** — The cart array is saved as JSON under the key `novacart_cart`, so it survives page refreshes and closing the browser.

**Checkout** — A form collects shipping details and a payment method choice, validates every field with JavaScript, then simulates placing an order.

**Form Validation** — Required fields, email format, phone/pincode digit patterns, and minimum name length are all checked in JavaScript before submission is allowed.

**Event Handling** — Every interactive element (menu, buttons, forms, filters) is wired up with `addEventListener`, including elements created dynamically at runtime (via event delegation on `document`).

**Responsive Design** — The layout adapts at 1024px, 768px, 480px and 360px using CSS media queries in `responsive.css`.

---

## 7. JavaScript Concepts Used

| Concept | Where Used |
|---|---|
| Variables (`let`, `const`) | Throughout all JS files |
| Conditions (`if/else`) | Form validation, cart quantity logic |
| Functions | Cart operations, rendering, validation |
| Arrays | `products` array, `cart` array |
| Objects | Each product, each cart item |
| Array Methods (`map`, `filter`, `find`, `forEach`, `reduce`) | Search/filter/sort, cart totals, rendering |
| DOM (`getElementById`, `querySelector`, `querySelectorAll`) | Reading and updating the page |
| Events (`click`, `submit`, `input`, `change`) | Buttons, forms, search box, dropdowns |
| Event Handling (`addEventListener`) | All interactivity, including event delegation |
| Local Storage | Cart persistence (`cart.js`) |

---

## 8. Learning Objectives

By studying this project, a beginner will practice:
- Structuring a multi-page website with shared HTML patterns (navbar/footer)
- Building a small design system with CSS variables
- Making a layout responsive with Flexbox, Grid, and media queries
- Rendering HTML dynamically from JavaScript data instead of hand-writing it
- Reading and writing browser Local Storage
- Passing data between pages using URL query parameters
- Writing and validating an HTML form with plain JavaScript
- Using array methods (`map`, `filter`, `find`, `reduce`) on real data

---

## 9. How the Cart Works

```
Product card
   ↓ (click "Add to Cart")
addToCart(id, qty)  →  reads cart from Local Storage
   ↓
adds/updates the { id, qty } entry
   ↓
saveCart(cart)  →  writes back to Local Storage + updates navbar badge
   ↓
Cart Page  →  renderCartPage() reads Local Storage + products.js
   ↓
Quantity buttons  →  updateQuantity()  →  re-render
   ↓
calculateTotals()  →  subtotal, shipping, discount, total
   ↓
Checkout  →  same calculateTotals(), then placeOrder()
   ↓
clearCart()  →  Local Storage emptied, order success shown
```

---

## 10. How Search Works

The search box listens for the `input` event. On every keystroke, `products-page.js` takes the current search text, lowercases it, and uses `Array.filter()` to keep only products whose name (also lowercased) contains that text. The grid is then re-rendered with just those matches.

## 11. How Filtering Works

Each category pill has a `data-category` attribute. Clicking one stores that category in a small `state` object and re-runs the same filter function, which checks `product.category === state.category` (or shows everything if the category is `"All"`).

## 12. How Sorting Works

The sort dropdown's `change` event stores the chosen order (`"low-to-high"` or `"high-to-low"`) in `state.sortOrder`. The filtered array is copied with `.slice()` (so the original order is never lost) and sorted with `Array.sort()` comparing `a.price` and `b.price`.

## 13. How Events Work

Example from `main.js`:

```js
document.addEventListener("click", function (event) {
    const button = event.target.closest(".add-to-cart-btn");
    if (!button) return;
    const productId = Number(button.dataset.id);
    addToCart(productId, 1);
});
```

This listens on the whole `document` instead of each button individually. That's called **event delegation** — it works even for buttons that don't exist yet when the page first loads (like product cards rendered later by JavaScript).

## 14. Local Storage Explanation

- `localStorage.setItem("novacart_cart", JSON.stringify(cart))` — saves the cart array as a text string.
- `localStorage.getItem("novacart_cart")` — reads that string back.
- `JSON.parse(...)` — converts the text string back into a real JavaScript array.
- `localStorage.removeItem(...)` is not needed here since `clearCart()` simply saves an empty array `[]`.

## 15. Important Functions

| Function | Purpose | Input | Output |
|---|---|---|---|
| `getProductById(id)` | Find one product | product id | product object or `undefined` |
| `addToCart(id, qty)` | Add/increase a cart item | product id, quantity | none (saves to Local Storage) |
| `removeFromCart(id)` | Remove a cart item | product id | none |
| `updateQuantity(id, qty)` | Set a specific quantity | product id, new quantity | none |
| `calculateTotals()` | Compute cart totals | none | `{ subtotal, shipping, discount, total, itemCount }` |
| `renderProducts()` | Redraw the product grid | none (reads `state`) | none |
| `handleCheckoutSubmit(e)` | Validate + place an order | form submit event | none |

## 16. Responsive Design

`responsive.css` uses `max-width` media queries at 1024px, 768px, 480px and 360px to reduce the number of grid columns, stack the two-column layouts (cart, checkout, details, contact) into one column, and switch the navbar into a hamburger menu.

## 17. Testing Checklist

- [ ] Navbar works
- [ ] Mobile menu works
- [ ] Search works
- [ ] Filter works
- [ ] Sorting works
- [ ] Product details work
- [ ] Add to cart works
- [ ] Quantity works
- [ ] Remove works
- [ ] Cart survives refresh
- [ ] Checkout validation works
- [ ] Empty cart works
- [ ] Mobile layout works

## 18. Future Improvements

These are intentionally **not** implemented, since this is a frontend-only learning project:
- A real backend and database
- User authentication and accounts
- A real payment gateway
- An admin panel for managing products
- A real product API
- Order history and order management

---

© 2026 NovaCart. A learning project.
