// ===========================================
// MATCHA CAT CAFE — matcha-cat.js
// ===========================================


// -------------------------------------------
// MENU — Tab switching
// -------------------------------------------
function showCategory(category, event) {
  // Hide all sections
  document.querySelectorAll('.menu-category').forEach(section => {
    section.classList.add('hidden');
  });

  // Remove active from all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Show selected section and set tab active
  document.getElementById(category).classList.remove('hidden');
  event.target.classList.add('active');
}


// -------------------------------------------
// HELPERS — Show / clear error messages
// -------------------------------------------

function showError(errorId, message) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'inline';
  }
}

function clearError(errorId) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }
}

function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.style.display = 'none';
    el.textContent = '';
  });
}


// -------------------------------------------
// CREATE AN ACCOUNT — Validation (Kate)
// -------------------------------------------

const accountForm = document.getElementById('create-an-account-form');

if (accountForm) {

  // Clear errors as user types
  document.getElementById('username').oninput = () => {
    const val = document.getElementById('username').value.trim();
    if (val.length >= 3 && /^[a-zA-Z0-9_]+$/.test(val)) clearError('username-error');
  }
  document.getElementById('first-name').oninput = () => {
    if (document.getElementById('first-name').value.trim()) clearError('first-name-error');
  }
  document.getElementById('last-name').oninput = () => {
    if (document.getElementById('last-name').value.trim()) clearError('last-name-error');
  }
  document.getElementById('phone').oninput = () => {
    const val = document.getElementById('phone').value.trim();
    if (/^[\d\s\-().+]{7,15}$/.test(val)) clearError('phone-error');
  }
  document.getElementById('birthday').oninput = () => {
    const val = document.getElementById('birthday').value;
    if (val && new Date(val) < new Date()) clearError('birthday-error');
  }
  document.getElementById('email').oninput = () => {
    const val = document.getElementById('email').value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) clearError('email-error');
  }
  document.getElementById('password').oninput = () => {
    if (document.getElementById('password').value.length >= 8) clearError('password-error');
  }

  // Validate on submit
  accountForm.onsubmit = () => {
    clearAllErrors();
    let isValid = true;

    // Username
    const username = document.getElementById('username').value.trim();
    if (!username) {
      showError('username-error', 'Username is required.');
      isValid = false;
    } else if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      showError('username-error', 'Username must be at least 3 characters (letters, numbers, underscores only).');
      isValid = false;
    }

    // First name
    const firstName = document.getElementById('first-name').value.trim();
    if (!firstName) {
      showError('first-name-error', 'First name is required.');
      isValid = false;
    }

    // Last name
    const lastName = document.getElementById('last-name').value.trim();
    if (!lastName) {
      showError('last-name-error', 'Last name is required.');
      isValid = false;
    }

    // Phone
    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
      showError('phone-error', 'Phone number is required.');
      isValid = false;
    } else if (!/^[\d\s\-().+]{7,15}$/.test(phone)) {
      showError('phone-error', 'Please enter a valid phone number.');
      isValid = false;
    }

    // Birthday
    const birthday = document.getElementById('birthday').value;
    if (!birthday) {
      showError('birthday-error', 'Birthday is required.');
      isValid = false;
    } else if (new Date(birthday) >= new Date()) {
      showError('birthday-error', 'Please enter a valid birthday in the past.');
      isValid = false;
    }

    // Email
    const email = document.getElementById('email').value.trim();
    if (!email) {
      showError('email-error', 'Email is required.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email-error', 'Email must contain @ and a dot (.)');
      isValid = false;
    }

    // Password
    const password = document.getElementById('password').value;
    if (!password) {
      showError('password-error', 'Password is required.');
      isValid = false;
    } else if (password.length < 8) {
      showError('password-error', 'Password must be at least 8 characters.');
      isValid = false;
    }

    return isValid;
  }
}


// -------------------------------------------
// RESERVATION — Validation (Nadia)
// -------------------------------------------

const reservationForm = document.getElementById('reservation-form');

if (reservationForm) {

  // Clear errors as user types
  document.getElementById('fname').oninput = () => {
    if (document.getElementById('fname').value.trim()) clearError('fname-error');
  }
  document.getElementById('phone').oninput = () => {
    const val = document.getElementById('phone').value.trim();
    if (/^[\d\s\-().+]{7,15}$/.test(val)) clearError('phone-error');
  }
  document.getElementById('email').oninput = () => {
    const val = document.getElementById('email').value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) clearError('email-error');
  }
  document.getElementById('date').oninput = () => {
    if (document.getElementById('date').value) clearError('date-error');
  }
  document.getElementById('time').oninput = () => {
    if (document.getElementById('time').value) clearError('time-error');
  }
  document.getElementById('size').onchange = () => {
    if (document.getElementById('size').value) clearError('size-error');
  }

  // Validate on submit
  reservationForm.onsubmit = () => {
    clearAllErrors();
    let isValid = true;

    // First name
    const fname = document.getElementById('fname').value.trim();
    if (!fname) {
      showError('fname-error', 'First name is required.');
      isValid = false;
    }

    // Phone
    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
      showError('phone-error', 'Phone number is required.');
      isValid = false;
    } else if (!/^[\d\s\-().+]{7,15}$/.test(phone)) {
      showError('phone-error', 'Please enter a valid phone number.');
      isValid = false;
    }

    // Email
    const email = document.getElementById('email').value.trim();
    if (!email) {
      showError('email-error', 'Email is required.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email-error', 'Please enter a valid email address.');
      isValid = false;
    }

    // Date — must be today or future
    const date = document.getElementById('date').value;
    const today = new Date().toISOString().split('T')[0];
    if (!date) {
      showError('date-error', 'Please select a date.');
      isValid = false;
    } else if (date < today) {
      showError('date-error', 'Please select a date in the future.');
      isValid = false;
    }

    // Time
    const time = document.getElementById('time').value;
    if (!time) {
      showError('time-error', 'Please select a time.');
      isValid = false;
    }

    // Party size
    const size = document.getElementById('size').value;
    if (!size) {
      showError('size-error', 'Please select a party size.');
      isValid = false;
    }

    return isValid;
  }
}