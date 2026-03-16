// -- Kate Nguyen 
// --- SERVER SIDE VALIDATION FOR CREATE AN ACCOUNT ---


export function validateAccount(data) {
  console.log('Server side validation happens here');
  console.log(data);

  // store error messages
  const errors = {};

  // validate username
  if (!data.username || data.username.trim() === '') {
    errors.username = 'Username is required.';
  } else if (data.username.trim().length < 3 || !/^[a-zA-Z0-9_]+$/.test(data.username.trim())) {
    errors.username = 'Username must be at least 3 characters (letters, numbers, underscores only).';
  }

  // validate first name
  if (!data.fname || data.fname.trim() === '') {
    errors.fname = 'First name is required.';
  }

  // validate last name
  if (!data.lname || data.lname.trim() === '') {
    errors.lname = 'Last name is required.';
  }

  // validate phone
  if (!data.phone || data.phone.trim() === '') {
    errors.phone = 'Phone number is required.';
  } else if (!/^[\d\s\-().+]{7,15}$/.test(data.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }

  // validate birthday — must be in the past
  if (!data.birthday) {
    errors.birthday = 'Birthday is required.';
  } else if (new Date(data.birthday) >= new Date()) {
    errors.birthday = 'Please enter a valid birthday in the past.';
  }

  // validate email
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  // validate password
  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  console.log(errors);
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}