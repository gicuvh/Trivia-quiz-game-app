const form = document.querySelector("form");
const passwordInput = document.getElementById("Password");
const confirmPasswordInput = document.getElementById("confirm-password");
const emailInput = document.querySelector('input[type="email"]');


document.querySelectorAll(".input-box").forEach((box) => {
    const input = box.querySelector("input");
    if (input.type === "password") {
        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "toggle-password";
        toggleBtn.innerHTML = `<i class='bx bx-hide'></i>`;
        box.appendChild(toggleBtn);

        toggleBtn.addEventListener("click", () => {
            if (input.type === "password") {
                input.type = "text";
                toggleBtn.innerHTML = `<i class='bx bx-show'></i>`;
            } else {
                input.type = "password";
                toggleBtn.innerHTML = `<i class='bx bx-hide'></i>`;
            }
        });
    }
});


function isValidPassword(password) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const noSymbols = /^[A-Za-z0-9]*$/.test(password); // doar litere și cifre

    return minLength && hasUpperCase && hasNumber && noSymbols;
}


function isValidEmail(email) {
    return email.endsWith("@gmail.com");
}


form.addEventListener("submit", (e) => {
    const pass = passwordInput.value;
    const confirm = confirmPasswordInput.value;
    const email = emailInput.value;

    if (!isValidEmail(email)) {
        alert("Emailul trebuie să fie de forma utilizator@gmail.com");
        e.preventDefault();
    } else if (!isValidPassword(pass)) {
        alert("Parola trebuie să aibă minim 8 caractere, o literă mare și o cifră, fără simboluri.");
        e.preventDefault();
    } else if (pass !== confirm) {
        alert("Parolele nu coincid!");
        e.preventDefault();
    } else {
        e.preventDefault(); 
        alert("Înregistrare reușită!");
        form.reset();
    }
    if (localStorage.getItem('username') === username) {
        alert("Acest username este deja utilizat.");
        return;
    }

    
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    window.location.href = "../Autentificare/login.html";
});