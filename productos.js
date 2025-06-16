// Función para agregar productos al carrito
function addToCart(button) {
  // Verificar si usuario está logueado
  const user = sessionStorage.getItem("loggedInUser");
  if (!user) {
    showMessage("You must log in to add products to the cart.", "red", "product");
    // Aquí puedes llamar a la función que muestre el modal de login, si tienes
    // showLoginModal();
    return; // Salir para que no agregue nada
  }

  const productDiv = button.parentElement;
  const id = productDiv.getAttribute("data-id");
  const name = productDiv.getAttribute("data-name");
  const price = parseFloat(productDiv.getAttribute("data-price"));
  const image = productDiv.getAttribute("data-image");

  // Validación defensiva: comprobar que el precio es un número
  if (isNaN(price)) {
    showMessage("Error: Invalid product price.", "red", "product");
    return;
  }

  const product = { id, name, price, image };

  // Obtener el carrito desde localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Mostrar mensaje en el DOM con el nombre del producto
  showMessage(`"${name}" has been added to cart!`, "white", "product");
}

// Función utilitaria para mostrar mensajes
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

// Guardar mensaje en el localStorage
function saveMessageToStorage(text, color, type) {
  localStorage.setItem("messageText", text);
  localStorage.setItem("messageColor", color);
  localStorage.setItem("messageType", type);
}

// Limpiar mensaje del localStorage
function clearMessageStorage() {
  localStorage.removeItem("messageText");
  localStorage.removeItem("messageColor");
  localStorage.removeItem("messageType");
}

// Evento que se ejecuta al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  const storedType = localStorage.getItem("messageType");
  if (storedType !== "product") showMessage("");

  // Asignar eventos a todos los botones de "Add to Cart"
  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach(button => {
    button.addEventListener("click", () => addToCart(button));
  });
});
