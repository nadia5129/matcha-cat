// matcha-cat.js — Client-side form validation for Create Account - Kate

document.getElementById("create-an-account-form").onsubmit = () => {
    clearErrors();
    let isValid = true;

    // Validate username
    let username = document.getElementById("username").value.trim();
    if (!username) {
        showError("username-error", "Username is required.");
        isValid = false;
    } else if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        showError("username-error", "Username must be at least 3 characters (letters, numbers, underscores only).");
        isValid = false;
    }

    // Validate first name
    let firstName = document.getElementById("first-name").value.trim();
    if (!firstName) {
        showError("first-name-error", "First name is required.");
        isValid = false;
    }

    // Validate last name
    let lastName = document.getElementById("last-name").value.trim();
    if (!lastName) {
        showError("last-name-error", "Last name is required.");
        isValid = false;
    }

    // Validate phone number
    let phone = document.getElementById("phone").value.trim();
    if (!phone) {
        showError("phone-error", "Phone number is required.");
        isValid = false;
    } else if (!/^[\d\s\-().+]{7,15}$/.test(phone)) {
        showError("phone-error", "Please enter a valid phone number.");
        isValid = false;
    }

    // Validate birthday
    let birthday = document.getElementById("birthday").value;
    if (!birthday) {
        showError("birthday-error", "Birthday is required.");
        isValid = false;
    } else if (new Date(birthday) >= new Date()) {
        showError("birthday-error", "Please enter a valid birthday in the past.");
        isValid = false;
    }

    // Validate email
    let email = document.getElementById("email").value.trim();
    if (!email) {
        showError("email-error", "Email is required.");
        isValid = false;
    } else {
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError("email-error", "Email must contain @ and a dot (.)");
            isValid = false;
        }
    }

    // Validate password
    let password = document.getElementById("password").value;
    if (!password) {
        showError("password-error", "Password is required.");
        isValid = false;
    } else if (password.length < 8) {
        showError("password-error", "Password must be at least 8 characters.");
        isValid = false;
    }

    return isValid;
}

/* Show an error message next to a field */
function showError(errorId, message) {
    let errorEl = document.getElementById(errorId);
    errorEl.textContent = message;
    errorEl.style.display = "inline";
}

/* Clear all error messages when form is submitted */
function clearErrors() {
    let errors = document.getElementsByClassName("error-msg");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
        errors[i].textContent = "";
    }
}

/* Clear error on a field as soon as the user corrects it */
document.getElementById("username").oninput = () => {
    let val = document.getElementById("username").value.trim();
    if (val.length >= 3 && /^[a-zA-Z0-9_]+$/.test(val))
        clearError("username-error");
}
document.getElementById("first-name").oninput = () => {
    if (document.getElementById("first-name").value.trim())
        clearError("first-name-error");
}
document.getElementById("last-name").oninput = () => {
    if (document.getElementById("last-name").value.trim())
        clearError("last-name-error");
}
document.getElementById("phone").oninput = () => {
    let val = document.getElementById("phone").value.trim();
    if (/^[\d\s\-().+]{7,15}$/.test(val))
        clearError("phone-error");
}
document.getElementById("birthday").oninput = () => {
    let val = document.getElementById("birthday").value;
    if (val && new Date(val) < new Date())
        clearError("birthday-error");
}
document.getElementById("email").oninput = () => {
    let val = document.getElementById("email").value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
        clearError("email-error");
}
document.getElementById("password").oninput = () => {
    if (document.getElementById("password").value.length >= 8)
        clearError("password-error");
}

/* Clear a single error message */
function clearError(errorId) {
    let errorEl = document.getElementById(errorId);
    errorEl.style.display = "none";
    errorEl.textContent = "";
}