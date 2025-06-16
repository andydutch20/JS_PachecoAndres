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

// Variables globales para facilitar acceso y manipulación
let cart = [];
const cartItemsDiv = document.getElementById("cart-items");
const totalDiv = document.getElementById("total");

// Función para renderizar todo el carrito
function renderCart() {
  if (!cartItemsDiv || !totalDiv) return;

  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    showMessage("");
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.textContent = "";
    return;
  }

  showMessage("Cart Ready.", "white", "cart");

  let total = 0;
  cart.forEach((item, index) => {
    renderCartItem(item, index);
    const price = parseFloat(item.price);
    total += isNaN(price) ? 0 : price;
  });

  totalDiv.textContent = `Total: $${total.toFixed(2)}`;

  // Añadir botón de limpiar carrito si no existe
  if (!document.getElementById("clear-cart-btn")) {
    const clearBtn = document.createElement("button");
    clearBtn.id = "clear-cart-btn";
    clearBtn.textContent = "Clear Cart";
    clearBtn.addEventListener("click", clearCart);
    totalDiv.appendChild(document.createElement("br"));
    totalDiv.appendChild(clearBtn);
  }
}

// Renderizar un item individual del carrito
function renderCartItem(item, index) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "cart-item";
  itemDiv.innerHTML = `
    <img src="${item.image}" alt="${item.name}" style="width: 100px; height: auto;">
    <p><strong>${item.name}</strong> - $${item.price}</p>
    <button class="remove-btn" data-index="${index}">Remove</button>
  `;
  cartItemsDiv.appendChild(itemDiv);
}

// Función para remover un item y actualizar vista
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showMessage("Item removed from cart.", "orange", "cart");
  renderCart();
}

// Limpiar todo el carrito y actualizar vista
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  showMessage("Cart cleared.", "red", "cart");
  renderCart();
}

// Delegación de eventos para remover items (botones dinámicos)
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    removeItem(index);
  }
});

// Evento al cargar DOM para cargar el carrito e inicializar
document.addEventListener("DOMContentLoaded", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart();
});
