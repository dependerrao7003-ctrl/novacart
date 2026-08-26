/* ==========================================================================
   NovaCart — contact.js
   Validates and "submits" the contact form (no real server involved).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) {
        return; // Not on the contact page
    }
    contactForm.addEventListener("submit", handleContactSubmit);
});

/**
 * handleContactSubmit(event)
 * Purpose: validate the contact form fields and show a success message
 *          when everything is filled in correctly.
 * Input: event (form submit event)
 * Output: none
 */
function handleContactSubmit(event) {
    event.preventDefault();

    const fields = {
        name: document.getElementById("contactName"),
        email: document.getElementById("contactEmail"),
        subject: document.getElementById("contactSubject"),
        message: document.getElementById("contactMessage")
    };

    let isValid = true;

    if (fields.name.value.trim().length < 3) {
        showContactError(fields.name, "Please enter your name.");
        isValid = false;
    } else {
        clearContactError(fields.name);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(fields.email.value.trim())) {
        showContactError(fields.email, "Please enter a valid email address.");
        isValid = false;
    } else {
        clearContactError(fields.email);
    }

    if (fields.subject.value.trim().length < 3) {
        showContactError(fields.subject, "Please enter a subject.");
        isValid = false;
    } else {
        clearContactError(fields.subject);
    }

    if (fields.message.value.trim().length < 10) {
        showContactError(fields.message, "Please write a message with at least 10 characters.");
        isValid = false;
    } else {
        clearContactError(fields.message);
    }

    if (!isValid) {
        return;
    }

    document.getElementById("contactForm").reset();
    document.getElementById("contactSuccess").style.display = "block";
    showToast("Your message has been submitted successfully.");
}

function showContactError(inputEl, message) {
    const group = inputEl.closest(".form-group");
    group.classList.add("invalid");
    group.querySelector(".error-message").textContent = message;
}

function clearContactError(inputEl) {
    const group = inputEl.closest(".form-group");
    group.classList.remove("invalid");
    group.querySelector(".error-message").textContent = "";
}
