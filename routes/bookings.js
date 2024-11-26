// booking.js

document.addEventListener('DOMContentLoaded', () => {
  // Get the form and all form elements
  const bookingForm = document.getElementById('booking-form');
  const destinationSelect = document.getElementById('destination');
  const bookingDateInput = document.getElementById('booking-date');
  
  // Add event listener for form submission
  bookingForm.addEventListener('submit', (event) => {
    // Prevent form submission if validation fails
    if (!validateForm()) {
      event.preventDefault();
    }
  });

  // Validate the booking form
  function validateForm() {
    let isValid = true;

    // Check if destination is selected
    if (destinationSelect.value === '') {
      alert('Please select a destination');
      isValid = false;
    }

    // Check if the booking date is provided
    if (bookingDateInput.value === '') {
      alert('Please select a booking date');
      isValid = false;
    }

    return isValid;
  }
});
