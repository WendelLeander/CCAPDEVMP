function toggleDropdown() {
  document.getElementById("establishmentDropdown").classList.toggle("show");
}

function toggleProfile() {
  document.getElementById("profileDropdown").classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".carousel-item");
  let index = 0;

  function showNext() {
      items.forEach((item, i) => {
          if (i === index) {
              item.classList.add("active");
              
          } else {
              item.classList.remove("active");
              
          }
      });
      index = (index + 1) % items.length;
  }

  setInterval(showNext, 4000); 
  showNext(); 
});



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


