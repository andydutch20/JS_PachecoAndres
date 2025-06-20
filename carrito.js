// Función para mostrar mensajes en pantalla
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

// Guardar mensaje en localStorage
function saveMessageToStorage(text, color, type) {
  localStorage.setItem("messageText", text);
  localStorage.setItem("messageColor", color);
  localStorage.setItem("messageType", type);
}

// Borrar mensaje de localStorage
function clearMessageStorage() {
  localStorage.removeItem("messageText");
  localStorage.removeItem("messageColor");
  localStorage.removeItem("messageType");
}

// Variables globales
let cart = [];
const cartItemsDiv = document.getElementById("cart-items");
const totalDiv = document.getElementById("total");
const cartActions = document.getElementById("cart-actions");
const purchaseBtn = document.getElementById("completePurchaseBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const modal = document.getElementById("paymentModal");
const closeModal = document.getElementById("closeModal");
const paymentForm = document.getElementById("paymentForm");
const confirmationMessage = document.getElementById("confirmationMessage");
const paymentSummary = document.getElementById("payment-summary");
const selectedPaymentMethod = document.getElementById("selectedPaymentMethod");
const orderNumber = document.getElementById("orderNumber");
const goToPartsBtn = document.getElementById("goToParts");

// Renderizar carrito en pantalla
function renderCart() {
  if (!cartItemsDiv || !totalDiv) return;

  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    showMessage("");
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.textContent = "";
    cartActions.classList.add("hidden");
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
  if (paymentSummary) {
    paymentSummary.textContent = `Total: $${total.toFixed(2)}`;
  }
  cartActions.classList.remove("hidden");
}

// Mostrar cada producto del carrito
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

// Eliminar un producto del carrito
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showMessage("Item removed from cart.", "orange", "cart");
  renderCart();
}

// Vaciar completamente el carrito
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  showMessage("Cart cleared.", "red", "cart");
  renderCart();
}

// Detectar clics en botones dinámicos para eliminar productos
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    removeItem(index);
  }
});

// Cargar el carrito al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart();
});

// Mostrar modal al dar clic en "Completar compra"
purchaseBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Cerrar modal con la X
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Procesar pago simulado
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const selectedOption = paymentForm.querySelector('input[name="method"]:checked');
  const paymentMethod = selectedOption ? selectedOption.parentElement.textContent.trim() : "No especificado";

  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  // Ocultar modal y mostrar confirmación
  modal.style.display = "none";
  confirmationMessage.classList.remove("hidden");

  selectedPaymentMethod.textContent = `Payment method: ${paymentMethod}`;
  orderNumber.textContent = `Order number: ${orderId}`;

  // Limpiar carrito y actualizar vista
  localStorage.removeItem("cart");
  cart = [];
  renderCart();

  // Hacer scroll al mensaje
  confirmationMessage.scrollIntoView({ behavior: "smooth" });
});

// Botón para ir a la página de partes
goToPartsBtn.addEventListener("click", () => {
  confirmationMessage.classList.add("hidden");
  window.location.href = "../paginas/partes.html";
});

// Hacer funcional el botón "Vaciar carrito"
clearCartBtn.addEventListener("click", clearCart);
