/* ==========================================================================
   NovaCart — products-page.js
   Powers the Products listing page: search box, category filter,
   price sorting, and dynamic rendering of the results grid.
   ========================================================================== */

// Keep track of the current filter/search/sort state in one place
const state = {
    searchTerm: "",
    category: "All",
    sortOrder: "default"
};

document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("productsGrid");
    if (!grid) {
        return; // Not on the products page
    }

    setupCategoryFromURL();
    setupSearch();
    setupCategoryPills();
    setupSort();
    renderProducts();
});

/**
 * setupCategoryFromURL()
 * Purpose: read a ?category=Electronics parameter from the URL (used when
 *          the user clicks a category card on the homepage) and apply it.
 * Input: none
 * Output: none
 */
function setupCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
        state.category = category;
    }
}

/**
 * setupSearch()
 * Purpose: wire up the search input so typing filters the product grid live.
 * Input: none
 * Output: none
 */
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        return;
    }
    searchInput.addEventListener("input", function () {
        state.searchTerm = searchInput.value.trim().toLowerCase();
        renderProducts();
    });
}

/**
 * setupCategoryPills()
 * Purpose: wire up the category filter buttons (All / Electronics / ...).
 * Input: none
 * Output: none
 */
function setupCategoryPills() {
    const pills = document.querySelectorAll(".category-pill");
    if (!pills.length) {
        return;
    }

    pills.forEach(function (pill) {
        // Mark the pill active if it matches the category from the URL
        if (pill.dataset.category === state.category) {
            pill.classList.add("active");
        } else {
            pill.classList.remove("active");
        }

        pill.addEventListener("click", function () {
            state.category = pill.dataset.category;

            pills.forEach(function (p) {
                p.classList.remove("active");
            });
            pill.classList.add("active");

            renderProducts();
        });
    });
}

/**
 * setupSort()
 * Purpose: wire up the price sort dropdown.
 * Input: none
 * Output: none
 */
function setupSort() {
    const sortSelect = document.getElementById("sortSelect");
    if (!sortSelect) {
        return;
    }
    sortSelect.addEventListener("change", function () {
        state.sortOrder = sortSelect.value;
        renderProducts();
    });
}

/**
 * getFilteredProducts()
 * Purpose: apply the current search term, category, and sort order to the
 *          full products array.
 * Input: none
 * Output: array of product objects
 */
function getFilteredProducts() {
    let result = products.filter(function (product) {
        const matchesSearch = product.name.toLowerCase().includes(state.searchTerm);
        const matchesCategory = state.category === "All" || product.category === state.category;
        return matchesSearch && matchesCategory;
    });

    if (state.sortOrder === "low-to-high") {
        result = result.slice().sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (state.sortOrder === "high-to-low") {
        result = result.slice().sort(function (a, b) {
            return b.price - a.price;
        });
    }

    return result;
}

/**
 * renderProducts()
 * Purpose: re-draw the product grid and results count based on the
 *          current filter/search/sort state.
 * Input: none
 * Output: none
 */
function renderProducts() {
    const grid = document.getElementById("productsGrid");
    const resultsCount = document.getElementById("resultsCount");
    const filtered = getFilteredProducts();

    if (resultsCount) {
        resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> Products`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No products found.</h3>
                <p>Try a different search term or category.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(buildProductCardHTML).join("");
}
