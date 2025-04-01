document.getElementById("password").addEventListener("input", function () {
    const password = this.value;
    const errorMsg = document.getElementById("password-error");
    const validMsg = document.getElementById("password-valid");
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;

    if (!regex.test(password)) {
        errorMsg.style.display = "block";
        validMsg.style.display = "none";
    } else {
        errorMsg.style.display = "none";
        validMsg.style.display = "block";
    }
});

document.getElementById("password").addEventListener("focus", function () {
    const validMsg = document.getElementById("password-valid");
    const password = this.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    if (!regex.test(password)) {
        validMsg.style.display = "none";
    } else {
        validMsg.style.display = "block";
    }
});

document.getElementById("password").addEventListener("blur", function () {
    const validMsg = document.getElementById("password-valid");
    validMsg.style.display = "none";
});

function addPhotoInput() {
    const div = document.createElement('div');
    div.innerHTML = '<input type="text" name="photos[]" placeholder="Enter image URL">';
    document.getElementById('photoInputs').appendChild(div);
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const confirmPasswordMessage = document.getElementById("confirm-password-message");

    form.addEventListener("submit", function (event) {
        if (passwordInput.value !== confirmPasswordInput.value) {
            event.preventDefault(); // Prevent form submission
            confirmPasswordMessage.style.display = "block";
            confirmPasswordMessage.style.color = "red";
            confirmPasswordMessage.textContent = "❌ Passwords do not match!";
        }
    });

    confirmPasswordInput.addEventListener("input", function () {
        if (confirmPasswordInput.value === "") {
            confirmPasswordMessage.style.display = "none";
            return;
        }

        if (passwordInput.value === confirmPasswordInput.value) {
            confirmPasswordMessage.style.display = "block";
            confirmPasswordMessage.style.color = "green";
            confirmPasswordMessage.textContent = "✅ Passwords match!";
        } else {
            confirmPasswordMessage.style.display = "block";
            confirmPasswordMessage.style.color = "red";
            confirmPasswordMessage.textContent = "❌ Passwords do not match!";
        }
    });
});

document.getElementById("confirm-password").addEventListener("focus", function () {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const confirmPasswordMessage = document.getElementById("confirm-password-message");

    if (passwordInput.value != confirmPasswordInput.value) {
        confirmPasswordMessage.style.display = "block";
        confirmPasswordMessage.style.color = "red";
        confirmPasswordMessage.textContent = "❌ Passwords do not match!";
    } else {
        confirmPasswordMessage.style.display = "block";
        confirmPasswordMessage.style.color = "green";
        confirmPasswordMessage.textContent = "✅ Passwords match!";
    }
});

document.getElementById("confirm-password").addEventListener("blur", function () {
    const confirmPasswordMessage = document.getElementById("confirm-password-message");
    confirmPasswordMessage.style.display = "none";
});

function togglePassword() {
    let passwordField = document.getElementById("password");
    let passwordField2 = document.getElementById("confirm-password");
    if (passwordField.type === "password" && passwordField2.type === "password") {
      passwordField.type = "text";
      passwordField2.type = "text";
    } else {
      passwordField.type = "password";
      passwordField2.type = "password";
    }
  }



