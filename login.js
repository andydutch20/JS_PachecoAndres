// Elementos del DOM
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
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

// Inicializar login
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

  // Autocompletar usuario recordado si existe
  const rememberedUser = localStorage.getItem("rememberedUser");
  if (rememberedUser) {
    usernameInput.value = rememberedUser;
    document.getElementById("rememberMe").checked = true;
  }

  // Si ya hay sesión iniciada, mostrar mensaje
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (loggedInUser) mostrarBienvenida(loggedInUser);

  // Mostrar login modal al hacer clic en el ícono
  loginIcon.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
  });

  // Manejar login
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
      ocultarModalLogin();

      //  Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Login successful",
        timer: 2000,
        toast: true,
        position: "top-end",
        showConfirmButton: false
      });

      // Si había un producto pendiente, agregarlo al carrito
      const pending = JSON.parse(sessionStorage.getItem("pendingProduct"));
      if (pending) {
        addToCart(pending);
        sessionStorage.removeItem("pendingProduct");
      }

    } else {
      //  Mostrar error con SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Incorrect username or password.",
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false
      });
    }
  });

  // Manejar registro
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const regUsername = document.getElementById("regUsername").value.trim();
    const regPassword = document.getElementById("regPassword").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === regUsername)) {
      Swal.fire({
        icon: "warning",
        title: "Username already exists",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    users.push({ username: regUsername, password: regPassword });
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
      icon: "success",
      title: "Registered successfully",
      text: "Now you can log in.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000
    });

    registerForm.reset();
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    usernameInput.value = regUsername;
    document.getElementById("password").value = regPassword;
    usernameInput.focus();
  });

  //  Confirmación antes de cerrar sesión
  logoutBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("loggedInUser");
        localStorage.removeItem("cart");

        Swal.fire({
          icon: "info",
          title: "Logged out",
          text: "Your session ended and cart was cleared.",
          toast: true,
          timer: 2500,
          position: "top-end",
          showConfirmButton: false
        });

        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    });
  });

  // Botón "X" para cerrar el modal
  if (closeLoginModal) {
    closeLoginModal.addEventListener("click", () => ocultarModalLogin());
  }

  // Cerrar modal si el usuario hace clic fuera del contenido
  document.addEventListener("click", function (e) {
    const container = document.querySelector(".login-container");
    if (!loginModal.classList.contains("hidden") &&
        !container.contains(e.target) &&
        e.target !== loginIcon) {
      ocultarModalLogin();
    }
  });
}

// Mostrar mensaje de bienvenida al usuario
function mostrarBienvenida(username) {
  welcomeMessage.textContent = `Welcome, ${username}!`;
  logoutBtn.classList.remove("hidden");
  loginIcon.classList.add("hidden");
}

// Hacer login modal accesible desde otros archivos
window.showLoginModal = function (product) {
  if (product) {
    sessionStorage.setItem("pendingProduct", JSON.stringify(product));
  }
  loginModal.classList.remove("hidden");
};

// Ocultar el modal de login
function ocultarModalLogin() {
  loginModal.classList.add("hidden");
}
