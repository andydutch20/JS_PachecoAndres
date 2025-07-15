// Elementos del DOM
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginMessage = document.getElementById("loginMessage");
const loginModal = document.getElementById("loginModal");
const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");
const loginIcon = document.getElementById("loginIcon");
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const showRegisterBtn = document.getElementById("showRegister");
const showLoginBtn = document.getElementById("showLogin");
const closeLoginModal = document.getElementById("closeLoginModal");
const usernameInput = document.getElementById("username");

// ✅ Inicialización directa sin usar DOMContentLoaded
initLogin();

function initLogin() {
  // Alternar entre login y registro
  showRegisterBtn.addEventListener("click", () => {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
  });

  showLoginBtn.addEventListener("click", () => {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
  });

  // Autocompletar usuario recordado
  const rememberedUser = localStorage.getItem("rememberedUser");
  if (rememberedUser) {
    usernameInput.value = rememberedUser;
    document.getElementById("rememberMe").checked = true;
  }

  // Si ya hay sesión activa, mostrar bienvenida
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (loggedInUser) mostrarBienvenida(loggedInUser);

  // Abrir modal de login desde ícono
  loginIcon.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
  });

  // Enviar login
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = document.getElementById("password").value.trim();
    const remember = document.getElementById("rememberMe").checked;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      sessionStorage.setItem("loggedInUser", username);
      remember
        ? localStorage.setItem("rememberedUser", username)
        : localStorage.removeItem("rememberedUser");

      mostrarBienvenida(username);
      mostrarMensaje("Login Success.", "success");
      ocultarModalLogin();

      // Agregar producto pendiente después del login
      const pending = JSON.parse(sessionStorage.getItem("pendingProduct"));
      if (pending) {
        addToCart(pending);
        sessionStorage.removeItem("pendingProduct");
      }
    } else {
      loginMessage.textContent = "Incorrect username or password.";
      loginMessage.style.color = "red";
    }
  });

  // Enviar formulario de registro
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const regUsername = document.getElementById("regUsername").value.trim();
    const regPassword = document.getElementById("regPassword").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === regUsername)) {
      mostrarMensaje("Username already exists.", "error");
      return;
    }

    users.push({ username: regUsername, password: regPassword });
    localStorage.setItem("users", JSON.stringify(users));

    mostrarMensaje("Success. Now you can log in.", "success");

    registerForm.reset();
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    usernameInput.value = regUsername;
    document.getElementById("password").value = regPassword;
    usernameInput.focus();
  });

  // Botón de logout
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");

    // ✅ Vaciar carrito al cerrar sesión
    localStorage.removeItem("cart");

    mostrarMensaje("Session ended. Cart cleared.", "info");
    location.reload();
  });

  // Cerrar modal con botón "X"
  if (closeLoginModal) {
    closeLoginModal.addEventListener("click", () => ocultarModalLogin());
  }

  // Cerrar modal si se hace clic fuera del contenido
  document.addEventListener("click", function (e) {
    const container = document.querySelector(".login-container");
    if (!loginModal.classList.contains("hidden") &&
        !container.contains(e.target) &&
        e.target !== loginIcon) {
      ocultarModalLogin();
    }
  });
}

// Función para mostrar bienvenida
function mostrarBienvenida(username) {
  welcomeMessage.textContent = `Welcome, ${username}!`;
  logoutBtn.classList.remove("hidden");
  loginIcon.classList.add("hidden");
}

// Hacer accesible desde otros scripts
window.showLoginModal = function (product) {
  if (product) {
    sessionStorage.setItem("pendingProduct", JSON.stringify(product));
  }
  loginModal.classList.remove("hidden");
};

// Ocultar login modal
function ocultarModalLogin() {
  loginModal.classList.add("hidden");
  loginMessage.textContent = "";
}

// ✅ Función para mostrar mensajes visuales
function mostrarMensaje(texto, tipo = "info") {
  const box = document.getElementById("messageBox");
  box.textContent = texto;
  box.className = `message ${tipo}`;
  box.classList.remove("hidden");
  setTimeout(() => box.classList.add("hidden"), 3000);
}
