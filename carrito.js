// Función utilitaria para mostrar mensajes
function showMessage(text, color = "green", type = "cart") {
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
  const cartItemsDiv = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Si el carrito está vacío
  if (cart.length === 0) {
    showMessage("");
    if (cartItemsDiv) cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    if (totalDiv) totalDiv.textContent = "";
    return;
  }

  showMessage("Cart Ready.", "white", "cart");

  // Calcular total y renderizar los productos del carrito
  const total = cart.reduce((sum, item, index) => {
    renderCartItem(item, cartItemsDiv, index);
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  totalDiv.textContent = `Total: $${total}`;

  // Crear el botón de limpiar carrito con su evento
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear Cart";
  clearBtn.addEventListener("click", clearCart);
  totalDiv.appendChild(document.createElement("br"));
  totalDiv.appendChild(clearBtn);
});

// Renderizar cada producto del carrito
function renderCartItem(item, container, index) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "cart-item";
  itemDiv.innerHTML = `
    <img src="${item.image}" alt="${item.name}" style="width: 100px; height: auto;">
    <p><strong>${item.name}</strong> - $${item.price}</p>
    <button class="remove-btn" data-index="${index}">Remove</button>
  `;
  container.appendChild(itemDiv);
}

// Delegación de eventos para los botones de "Remove"
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    removeItem(index);
  }
});

// Remover producto individual del carrito
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showMessage("Item removed from cart.", "orange", "cart");
  location.reload();
}

// Limpiar el carrito completo
function clearCart() {
  localStorage.removeItem("cart");
  showMessage("Cart cleared.", "red", "cart");
  location.reload();
}
