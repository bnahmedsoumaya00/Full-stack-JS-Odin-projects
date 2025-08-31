document.addEventListener("DOMContentLoaded", () => {
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");
  const form = document.querySelector("form");

  function checkPasswordsMatch() {
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Passwords do not match");
    } else {
      confirmPassword.setCustomValidity("");
    }
  }

  password.addEventListener("input", checkPasswordsMatch);
  confirmPassword.addEventListener("input", checkPasswordsMatch);

  form.addEventListener("submit", (event) => {
    checkPasswordsMatch();
    if (!form.checkValidity()) {
      event.preventDefault();
    }
  });
});
