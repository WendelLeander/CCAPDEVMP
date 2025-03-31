function toggleDropdown() {
  document.getElementById("establishmentDropdown").classList.toggle("show");
}

function toggleProfile() {
  document.getElementById("profileDropdown").classList.toggle("show");
}

let currentSlide = 0;
const linkButton = document.getElementById('dynamicLink');
function showSlide(index) {
  const slides = document.querySelectorAll('.carousel-image');
  const totalSlides = slides.length;
  if (index >= totalSlides) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = totalSlides - 1;
  } else {
    currentSlide = index;
  }
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  linkButton.href = slides[currentSlide].dataset.link;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}