// Modal functionality
const modal = document.getElementById("bookingModal");
const openModalBtn = document.getElementById("openBookingModal");
const closeModalBtn = document.getElementById("closeModal");

openModalBtn.addEventListener("click", function() {
  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
});

closeModalBtn.addEventListener("click", function() {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Re-enable scrolling
});

window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Tour date visibility toggle
const tourRequestSelect = document.getElementById("tourRequest");
const tourDateContainer = document.getElementById("tourDateContainer");

tourRequestSelect.addEventListener("change", function() {
  if (this.value === "yes") {
    tourDateContainer.style.display = "block";
    document.getElementById("tourDate").setAttribute("required", "required");
  } else {
    tourDateContainer.style.display = "none";
    document.getElementById("tourDate").removeAttribute("required");
  }
});

// Form submission
const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function(e) {
  e.preventDefault();
  // Here you would typically send the form data to your server
  alert("Thank you for your booking request! We will contact you within 24 hours.");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
  bookingForm.reset();
});

// FAQ functionality
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(question => {
  question.addEventListener("click", function() {
    // Toggle active class on question
    this.classList.toggle("active");
    
    // Toggle show class on answer
    const answer = this.nextElementSibling;
    answer.classList.toggle("show");
  });
});