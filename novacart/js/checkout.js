/* ==========================================================================
   NovaCart — checkout.js
   Renders the order summary, validates the checkout form, and simulates
   placing an order (no real backend or payment processing involved).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const checkoutForm = document.getElementById("checkoutForm");
    if (!checkoutForm) {
        return; // Not on the checkout page
    }

    renderOrderSummary();
    setupPaymentOptions();
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
});

/**
 * renderOrderSummary()
 * Purpose: show the cart items and totals on the checkout page. If the
 *          cart is empty, disable the form and explain why.
 * Input: none
 * Output: none
 */
function renderOrderSummary() {
    const cart = getCart();
    const summaryList = document.getElementById("checkoutItems");
    const totals = calculateTotals();

    if (cart.length === 0) {
        document.getElementById("checkoutContent").innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty.</h3>
                <p>Add a few products before checking out.</p>
                <a class="btn btn-primary" href="products.html">Start Shopping</a>
            </div>
        `;
        return;
    }

    summaryList.innerHTML = cart.map(function (item) {
        const product = getProductById(item.id);
        if (!product) {
            return "";
        }
        return `
            <div class="summary-row">
                <span>${product.name} × ${item.qty}</span>
                <span>${formatPrice(product.price * item.qty)}</span>
            </div>
        `;
    }).join("");

    document.getElementById("checkoutSubtotal").textContent = formatPrice(totals.subtotal);
    document.getElementById("checkoutShipping").textContent = totals.shipping === 0 ? "Free" : formatPrice(totals.shipping);
    document.getElementById("checkoutDiscount").textContent = "-" + formatPrice(totals.discount);
    document.getElementById("checkoutTotal").textContent = formatPrice(totals.total);
}

/**
 * setupPaymentOptions()
 * Purpose: highlight whichever payment method radio button is selected.
 * Input: none
 * Output: none
 */
function setupPaymentOptions() {
    const options = document.querySelectorAll(".payment-option");
    options.forEach(function (option) {
        option.addEventListener("click", function () {
            options.forEach(function (o) {
                o.classList.remove("selected");
            });
            option.classList.add("selected");
            option.querySelector("input").checked = true;
        });
    });
}

/**
 * handleCheckoutSubmit(event)
 * Purpose: validate every field, and if everything is valid, place the
 *          order (generate an order id, clear the cart, show success).
 * Input: event (the form submit event)
 * Output: none
 */
function handleCheckoutSubmit(event) {
    event.preventDefault();

    const fields = {
        fullName: document.getElementById("fullName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        address: document.getElementById("address"),
        city: document.getElementById("city"),
        state: document.getElementById("state"),
        pincode: document.getElementById("pincode")
    };

    let isValid = true;

    if (fields.fullName.value.trim().length < 3) {
        showFieldError(fields.fullName, "Please enter your name.");
        isValid = false;
    } else {
        clearFieldError(fields.fullName);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(fields.email.value.trim())) {
        showFieldError(fields.email, "Please enter a valid email address.");
        isValid = false;
    } else {
        clearFieldError(fields.email);
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(fields.phone.value.trim())) {
        showFieldError(fields.phone, "Please enter a valid 10-digit phone number.");
        isValid = false;
    } else {
        clearFieldError(fields.phone);
    }

    if (fields.address.value.trim().length < 5) {
        showFieldError(fields.address, "Please enter your full address.");
        isValid = false;
    } else {
        clearFieldError(fields.address);
    }

    if (fields.city.value.trim().length < 2) {
        showFieldError(fields.city, "Please enter your city.");
        isValid = false;
    } else {
        clearFieldError(fields.city);
    }

    if (fields.state.value.trim().length < 2) {
        showFieldError(fields.state, "Please enter your state.");
        isValid = false;
    } else {
        clearFieldError(fields.state);
    }

    const pincodePattern = /^[0-9]{6}$/;
    if (!pincodePattern.test(fields.pincode.value.trim())) {
        showFieldError(fields.pincode, "Please enter a valid 6-digit pincode.");
        isValid = false;
    } else {
        clearFieldError(fields.pincode);
    }

    if (!isValid) {
        return;
    }

    placeOrder();
}

/**
 * showFieldError(inputEl, message)
 * Purpose: mark a form field invalid and display an error message under it.
 * Input: inputEl (the <input> element), message (string)
 * Output: none
 */
function showFieldError(inputEl, message) {
    const group = inputEl.closest(".form-group");
    group.classList.add("invalid");
    const errorEl = group.querySelector(".error-message");
    if (errorEl) {
        errorEl.textContent = message;
    }
}

/**
 * clearFieldError(inputEl)
 * Purpose: remove the invalid state and error message from a form field.
 * Input: inputEl (the <input> element)
 * Output: none
 */
function clearFieldError(inputEl) {
    const group = inputEl.closest(".form-group");
    group.classList.remove("invalid");
    const errorEl = group.querySelector(".error-message");
    if (errorEl) {
        errorEl.textContent = "";
    }
}

/**
 * generateOrderId()
 * Purpose: create a simple random order id for the success screen.
 * Input: none
 * Output: string, e.g. "NC482913"
 */
function generateOrderId() {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return "NC" + randomDigits;
}

/**
 * placeOrder()
 * Purpose: show the order success screen with a generated order id, and
 *          clear the cart since the "order" is now complete.
 * Input: none
 * Output: none
 */
function placeOrder() {
    const orderId = generateOrderId();

    document.getElementById("checkoutContent").style.display = "none";
    const successSection = document.getElementById("orderSuccess");
    successSection.style.display = "block";
    document.getElementById("orderIdText").textContent = orderId;

    clearCart();
}
