
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
// Edit establishment description
function editDesc() {
  var textElement = document.getElementById('editable-text');
  var editButton = document.getElementById('edit-button');
  var saveButton = document.getElementById('save-button');
  var currentText = textElement.innerText;

  var textarea = document.createElement('textarea');
  textarea.id = 'edit-textarea';
  textarea.value = currentText;

  textElement.replaceWith(textarea);
  editButton.classList.add('hidden');
  saveButton.classList.remove('hidden');
  saveButton.onclick = function () {
    saveDesc(textarea.value);
  };
}

function saveDesc(newText) {
  var textarea = document.getElementById('edit-textarea');
  var editButton = document.getElementById('edit-button');
  var saveButton = document.getElementById('save-button');

  var textElement = document.createElement('p');
  textElement.id = 'editable-text';
  textElement.innerText = newText;

  textarea.replaceWith(textElement);
  saveButton.classList.add('hidden');
  editButton.classList.remove('hidden');
}

// Edit establishment details
function editDetails() {
  var textElement = document.getElementById('editableDetails');
  var editButton = document.getElementById('edit-button2');
  var saveButton = document.getElementById('save-button2');
  var currentText = textElement.innerText;

  var textarea = document.createElement('textarea');
  textarea.id = 'edit-textarea2';
  textarea.value = currentText;

  textElement.replaceWith(textarea);
  editButton.classList.add('hidden2');
  saveButton.classList.remove('hidden2');
  saveButton.onclick = function () {
    saveDetails(textarea.value);
  };
}

function saveDetails(newText2) {
  var textarea = document.getElementById('edit-textarea2');
  var editButton = document.getElementById('edit-button2');
  var saveButton = document.getElementById('save-button2');

  var textElement = document.createElement('p');
  textElement.id = 'editableDetails';
  textElement.innerText = newText2;

  textarea.replaceWith(textElement);
  saveButton.classList.add('hidden2');
  editButton.classList.remove('hidden2');
}

// Script for creating, editing, deleting reviews
const reviews = [];

function addReview() {
  let text = document.getElementById('review-text').value.replace(/\n/g, '<br>'); // Handle new lines
  text = insertLineBreaks(text, 70); // Insert line breaks every 50 characters
  const media = document.getElementById('review-media').files[0];
  const rating = document.getElementById('review-rating').value;

  const review = {
    id: Date.now(),
    username: "Reviewer", // Placeholder username
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png", // Placeholder avatar
    date: new Date().toLocaleString(),
    text,
    media,
    rating,
    helpful: 0,
    unhelpful: 0,
    comments: []
  };

  reviews.push(review);
  renderReviews();
}

function addComment(index) {
  const commentInput = document.getElementById(`comment-input-${index}`);
  const commentText = commentInput.value.trim();
  if (!commentText) return;
  
  const comment = {
    id: Date.now(),
    username: "User", // Placeholder username
    avatar: "https://cdn-icons-png.flaticon.com/512/3607/3607444.png", // Placeholder avatar
    text: commentText,
    date: new Date().toLocaleString()
  };
  
  reviews[index].comments.push(comment);
  renderReviews();
}

function editComment(reviewIndex, commentId) {
  const review = reviews[reviewIndex];
  const comment = review.comments.find(c => c.id === commentId);
  const newText = prompt("Edit your comment:", comment.text);
  if (newText) {
    comment.text = newText;
    renderReviews();
  }
}

function deleteComment(reviewIndex, commentId) {
  const review = reviews[reviewIndex];
  review.comments = review.comments.filter(c => c.id !== commentId);
  renderReviews();
}

function insertLineBreaks(text, interval) {
  let result = '';
  for (let i = 0; i < text.length; i += interval) {
    result += text.slice(i, i + interval) + '<br>';
  }
  return result;
}

function renderReviews() {
  const reviewsContainer = document.getElementById('reviews');
  reviewsContainer.innerHTML = '';

  reviews.forEach((review, index) => {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review';

    let mediaElement = '';
    if (review.media) {
      const mediaType = review.media.type.startsWith('image') ? 'img' : 'video';
      mediaElement = `<${mediaType} src="${URL.createObjectURL(review.media)}" controls width="300"></${mediaType}>`;
    }

    const commentsHTML = review.comments.map(comment => `
      <div class="comment">
        <img src="${comment.avatar}" alt="User Avatar" class="comment-avatar" style="width: 40px; height: 40px; border-radius: 50%;">
        <div class="comment-content">
          <p><strong>${comment.username}</strong> - <span class="comment-date">${comment.date}</span></p>
          <p>${comment.text}</p>
          <button onclick="editComment(${index}, ${comment.id})">Edit</button>
          <button onclick="deleteComment(${index}, ${comment.id})">Delete</button>
        </div>
      </div>
    `).join('');

    reviewElement.innerHTML = `
                    <div class="review-header" style="display: flex; align-items: center;">
                        <img src="${review.avatar}" alt="Reviewer Avatar" class="review-avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                        <span><strong>${review.username}</strong></span>
                        <span class="review-date" style="margin-left: auto;">${review.date}</span>
                    </div>
                    <p class="text">${review.text}</p>
                    ${mediaElement}
                    <p>Rating: ${'★'.repeat(review.rating)}</p>
                    <div class="review-actions">
                        <span onclick="editReview(${index})">Edit</span> |
                        <span onclick="deleteReview(${index})">Delete</span> |
                        <span onclick="toggleCommentBox(${index})">Comment</span> |
                        <span onclick="markHelpful(${index})">Helpful (${review.helpful})</span> |
                        <span onclick="markUnhelpful(${index})">Unhelpful (${review.unhelpful})</span>
                    </div>
                    <div id="comment-box-${index}" class="comment-box" style="display: none;">
                        <input type="text" id="comment-input-${index}" placeholder="Write a comment..." oninput="toggleSendButton(${index})">
                        <button id="send-btn-${index}" onclick="addComment(${index})" disabled>Send</button>
                    </div>
                    <div class="comments-section">${commentsHTML}</div>
                `;

    reviewsContainer.appendChild(reviewElement);
  });
}

function toggleCommentBox(index) {
  const commentBox = document.getElementById(`comment-box-${index}`);
  commentBox.style.display = commentBox.style.display === 'none' ? 'block' : 'none';
}

function toggleSendButton(index) {
  const commentInput = document.getElementById(`comment-input-${index}`);
  const sendButton = document.getElementById(`send-btn-${index}`);
  sendButton.disabled = !commentInput.value.trim();
}

function editReview(index) {
  const review = reviews[index];
  document.getElementById('review-text').value = review.text;
  document.getElementById('review-rating').value = review.rating;
  reviews.splice(index, 1);
  renderReviews();
}

function deleteReview(index) {
  reviews.splice(index, 1);
  renderReviews();
}

function markHelpful(index) {
  reviews[index].helpful++;
  renderReviews();
}

function markUnhelpful(index) {
  reviews[index].unhelpful++;
  renderReviews();
}

window.onload = function () {
  const ratingValueElement = document.getElementById("rating-value");
  const ratingValue = parseFloat(ratingValueElement.textContent); // Get rating from HTML

  generateStars(ratingValue);
};

function generateStars(rating) {
  const starsContainer = document.getElementById("stars");
  starsContainer.innerHTML = ""; // Clear previous stars

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


