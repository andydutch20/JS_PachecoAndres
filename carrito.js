// Utilidades de mensajes (mostrar, guardar y limpiar mensajes en el DOM y LocalStorage)

// Función para mostrar mensajes en pantalla y guardarlos en localStorage
function showMessage(text, color = "green", type = "cart") {
  const messageDiv = document.getElementById("message"); // Obtener el div de mensajes
  if (!messageDiv) return; // Si no existe el div, no hace nada

  if (text) { // Si hay texto, mostramos el mensaje
    messageDiv.textContent = text;
    messageDiv.style.color = color;
    messageDiv.style.display = "block";
    saveMessageToStorage(text, color, type); // Guardamos el mensaje en el almacenamiento local
  } else { // Si no hay texto, limpiamos el mensaje
    clearMessageStorage();
    messageDiv.textContent = "";
    messageDiv.style.display = "none";
  }
}

// Guardar los mensajes en el localStorage para mantener el estado entre páginas
function saveMessageToStorage(text, color, type) {
  localStorage.setItem("messageText", text);
  localStorage.setItem("messageColor", color);
  localStorage.setItem("messageType", type);
}

// Eliminar los mensajes del localStorage
function clearMessageStorage() {
  localStorage.removeItem("messageText");
  localStorage.removeItem("messageColor");
  localStorage.removeItem("messageType");
}

// Al cargar la página, renderizamos los productos que hay en el carrito
document.addEventListener("DOMContentLoaded", () => {
  const cartItemsDiv = document.getElementById("cart-items"); // Contenedor de productos del carrito
  const totalDiv = document.getElementById("total"); // Contenedor del total
  const cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtenemos el carrito desde el localStorage

  // Si el carrito está vacío, mostramos el mensaje de carrito vacío
  if (cart.length === 0) {
    showMessage("");
    if (cartItemsDiv) cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    if (totalDiv) totalDiv.textContent = "";
    return;
  }

  // Si hay productos, mostramos el mensaje de carrito cargado
  showMessage("Cart ready.", "white", "cart");

  // Renderizamos todos los productos usando forEach (Higher Order Function)
  cart.forEach((item, index) => renderCartItem(item, cartItemsDiv, index));

  // Calculamos el total usando reduce (Higher Order Function)
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Mostramos el total de la compra
  totalDiv.textContent = `Total: $${total}`;

  // Creamos el botón para limpiar el carrito
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear Cart";
  clearBtn.onclick = clearCart;
  totalDiv.appendChild(document.createElement("br"));
  totalDiv.appendChild(clearBtn);
});

// Función para renderizar cada producto del carrito en el DOM
function renderCartItem(item, container, index) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "cart-item";
  itemDiv.innerHTML = `
    <img src="${item.image}" alt="${item.name}" style="width: 100px; height: auto;">
    <p><strong>${item.name}</strong> - $${item.price}</p>
    <button onclick="removeItem(${index})">Remove</button>
  `;
  container.appendChild(itemDiv);
}

// Función para eliminar un producto específico del carrito
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtenemos el carrito
  cart.splice(index, 1); // Eliminamos el producto por índice
  localStorage.setItem("cart", JSON.stringify(cart)); // Actualizamos el carrito
  showMessage("Item removed.", "orange", "cart"); // Mostramos mensaje
  location.reload(); // Recargamos la página para actualizar la vista
}

// Función para vaciar todo el carrito
function clearCart() {
  localStorage.removeItem("cart"); // Eliminamos el carrito del localStorage
  showMessage("Cart cleared.", "red", "cart"); // Mostramos mensaje
  location.reload(); // Recargamos la página para actualizar la vista
}
