// Utilidades de mensajes (mostrar, guardar y limpiar mensajes para la página de productos)

// Función para mostrar mensajes en pantalla y guardar el mensaje en el localStorage
function showMessage(text, color = "green", type = "product") {
  const messageDiv = document.getElementById("message"); // Obtenemos el div donde irá el mensaje
  if (!messageDiv) return; // Si no existe el div, salimos

  if (text) { // Si hay texto, mostramos el mensaje
    messageDiv.textContent = text;
    messageDiv.style.color = color;
    messageDiv.style.display = "block";
    saveMessageToStorage(text, color, type); // Guardamos el mensaje actual en el localStorage
  } else { // Si no hay texto, limpiamos el mensaje
    clearMessageStorage();
    messageDiv.textContent = "";
    messageDiv.style.display = "none";
  }
}

// Guardar el mensaje actual en el localStorage
function saveMessageToStorage(text, color, type) {
  localStorage.setItem("messageText", text);
  localStorage.setItem("messageColor", color);
  localStorage.setItem("messageType", type);
}

// Limpiar el mensaje almacenado en el localStorage
function clearMessageStorage() {
  localStorage.removeItem("messageText");
  localStorage.removeItem("messageColor");
  localStorage.removeItem("messageType");
}

// Al cargar la página de productos, verificamos si hay un mensaje previamente guardado
document.addEventListener("DOMContentLoaded", () => {
  const messageDiv = document.getElementById("message"); // Obtenemos el div del mensaje
  if (!messageDiv) return; // Si no existe el div, salimos

  // Recuperamos los datos del mensaje almacenado
  const storedText = localStorage.getItem("messageText");
  const storedColor = localStorage.getItem("messageColor");
  const messageType = localStorage.getItem("messageType");

  // Si hay un mensaje almacenado y corresponde a la página de productos, lo mostramos
  if (storedText && messageType === "product") {
    messageDiv.textContent = storedText;
    messageDiv.style.color = storedColor || "green";
    messageDiv.style.display = "block";
  } else {
    // Si no hay mensaje o es de otro tipo, lo ocultamos
    messageDiv.textContent = "";
    messageDiv.style.display = "none";
  }
});

// Función para agregar un producto al carrito
function addToCart(button) {
  const productDiv = button.parentElement; // Obtenemos el contenedor del producto que fue clickeado
  const id = productDiv.getAttribute("data-id");
  const name = productDiv.getAttribute("data-name");
  const price = parseFloat(productDiv.getAttribute("data-price")); // Convertimos el precio a número (float)
  const image = productDiv.getAttribute("data-image");

  // Creamos un objeto producto
  const product = { id, name, price, image };

  // Recuperamos el carrito actual desde el localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product); // Agregamos el nuevo producto
  localStorage.setItem("cart", JSON.stringify(cart)); // Guardamos el carrito actualizado

  // Mostramos el mensaje de confirmación
  showMessage(`${name} added to cart!`, "white", "product");
}
