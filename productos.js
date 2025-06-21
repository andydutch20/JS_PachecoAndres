// Función para agregar productos al carrito
function addToCart(button) {
  // Verificar si el usuario está logueado
  const user = sessionStorage.getItem("loggedInUser");
  if (!user) {
    showMessage("You must log in to add products to the cart.", "red", "product");
    return;
  }

  const productDiv = button.parentElement;
  const id = productDiv.getAttribute("data-id");
  const name = productDiv.getAttribute("data-name");
  const price = parseFloat(productDiv.getAttribute("data-price"));
  const image = productDiv.getAttribute("data-image");

  if (isNaN(price)) {
    showMessage("Error: Invalid product price.", "red", "product");
    return;
  }

  const product = { id, name, price, image };

  // Obtener y actualizar el carrito
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Mostrar mensaje
  showMessage(`"${name}" has been added to cart!`, "white", "product");

  // Actualizar y animar contador
  updateCartCount();
}

// Función para mostrar mensajes temporales
function showMessage(text, color = "green", type = "product") {
  const messageDiv = document.getElementById("message");
  if (!messageDiv) return;

  if (text) {
    messageDiv.textContent = text;
    messageDiv.style.color = color;
    messageDiv.style.display = "block";
    saveMessageToStorage(text, color, type);
  } else {
    clearMessageStorage();
    messageDiv.textContent = "";
    messageDiv.style.display = "none";
  }
}

// Guardar mensaje en localStorage
function saveMessageToStorage(text, color, type) {
  localStorage.setItem("messageText", text);
  localStorage.setItem("messageColor", color);
  localStorage.setItem("messageType", type);
}

// Borrar mensaje
function clearMessageStorage() {
  localStorage.removeItem("messageText");
  localStorage.removeItem("messageColor");
  localStorage.removeItem("messageType");
}

// Actualizar y animar el contador del carrito
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (countSpan) {
    countSpan.textContent = cart.length;
    countSpan.classList.add("animate");
    setTimeout(() => countSpan.classList.remove("animate"), 300);
  }
}

// Al cargar la página, asignar eventos y mostrar cantidad
document.addEventListener("DOMContentLoaded", () => {
  const storedType = localStorage.getItem("messageType");
  if (storedType !== "product") showMessage("");

  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach(button => {
    button.addEventListener("click", () => addToCart(button));
  });

  updateCartCount();
});
