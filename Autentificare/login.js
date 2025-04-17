document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorMessage = document.getElementById("error-message");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      if (username === "admin" && password === "parola123") {
        errorMessage.textContent = "";
        window.location.href = "../Pagina_principala/index.html";
      } else {
        errorMessage.textContent = "Username sau parolă incorectă!";
      }
    });
  });