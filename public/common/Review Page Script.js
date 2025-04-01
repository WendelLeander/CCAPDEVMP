
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function myFunction2() {
  document.getElementById("myDropdown2").classList.toggle("show");
}
// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// Script for establishment image carousel
let currentSlide = 0;

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
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}


window.onload = function () {
  const ratingContainers = document.querySelectorAll(".rating");

  ratingContainers.forEach(container => {
    const ratingValueElement = container.querySelector("#rating-value");
    const starsContainer = container.querySelector("#stars");

    if (ratingValueElement && starsContainer) {
      const ratingValue = parseFloat(ratingValueElement.textContent);
      generateStars(ratingValue, starsContainer);
    }
  });
};

function generateStars(rating, starsContainer) {
  starsContainer.innerHTML = ""; 

  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    starsContainer.innerHTML += '<span class="star filled">★</span>';
  }

  if (hasHalfStar) {
    starsContainer.innerHTML += '<span class="star half-filled">★</span>';
  }

  const remainingStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < remainingStars; i++) {
    starsContainer.innerHTML += '<span class="star">★</span>';
  }
}


document.querySelector(".review-form").addEventListener("submit", function(event) {
  const textArea = document.getElementById("text");
  if (textArea.value.trim() === "") {
      event.preventDefault(); // Prevent form submission
      alert("Review cannot be empty or only contain spaces!");
  }
});

function toggleMenu(button) {
  let menu = button.nextElementSibling;
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function vote(reviewId, type, button) {
  fetch(`/reviews/${reviewId}/vote`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ type })
  })
  .then(response => response.json())
  .then(data => {
      if (data.error) {
          alert("Error: " + data.error);
          return;
      }
      
      
      button.querySelector(".count").innerText = type === "helpful" ? data.helpful : data.unhelpful;
  })
  .catch(error => console.error("Error updating review:", error));
}



