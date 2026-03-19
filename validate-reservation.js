function validateReservation(data) {
  const errors = {};

  if (!data.fname || data.fname.trim() === '') {
    errors.fname = 'First name is required.';
  }

  if (!data.lname || data.lname.trim() === '') {
    errors.lname = 'Last name is required.';
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.phone = 'Phone number is required.';
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email address is required.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  if (!data.date || data.date.trim() === '') {
    errors.date = 'Date is required.';
  }

  if (!data.time || data.time.trim() === '') {
    errors.time = 'Time is required.';
  }

  const allowedSizes = ['1', '2', '3', '4', '5+'];
  if (!allowedSizes.includes(data.size)) {
    errors.size = 'Please select a valid party size.';
  }

  return errors;
}