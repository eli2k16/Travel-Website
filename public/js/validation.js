// Validate login form
function validateLoginForm() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (!username || !password) {
    alert("Both username and password are required!");
    return false;
  }
  
  return true;
}

// Validate signup form
function validateSignupForm() {
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (!username || !password || !confirmPassword) {
    alert("All fields are required!");
    return false;
  }
  
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return false;
  }
  
  return true;
}

// Validate booking form
function validateBookingForm() {
  const destination = document.getElementById('destination').value;
  const date = document.getElementById('booking-date').value;
  
  if (!destination) {
    alert("Please select a destination.");
    return false;
  }

  if (!date) {
    alert("Please select a booking date.");
    return false;
  }
  
  return true;
}

// Validate CRUD form (Create/Update Destination)
function validateCrudForm() {
  const title = document.getElementById('destination-title').value;
  const description = document.getElementById('destination-description').value;
  const image = document.getElementById('destination-image').files[0];
  
  if (!title || !description || !image) {
    alert("All fields are required, including an image.");
    return false;
  }
  
  return true;
}

// Attach validation functions to forms
document.addEventListener('DOMContentLoaded', function () {
  // Attach validation for login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      if (!validateLoginForm()) {
        event.preventDefault();  // Prevent form submission if validation fails
      }
    });
  }

  // Attach validation for signup
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
      if (!validateSignupForm()) {
        event.preventDefault();  // Prevent form submission if validation fails
      }
    });
  }

  // Attach validation for booking
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (event) {
      if (!validateBookingForm()) {
        event.preventDefault();  // Prevent form submission if validation fails
      }
    });
  }

  // Attach validation for CRUD
  const crudForm = document.getElementById('crud-form');
  if (crudForm) {
    crudForm.addEventListener('submit', function (event) {
      if (!validateCrudForm()) {
        event.preventDefault();  // Prevent form submission if validation fails
      }
    });
  }
});
