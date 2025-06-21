// Variables globales del carrito
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

// Mostrar mensajes en pantalla
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

// Guardar y limpiar mensaje en localStorage
function saveMessageToStorage(text, color, type) {
  localStorage.setItem("messageText", text);
  localStorage.setItem("messageColor", color);
  localStorage.setItem("messageType", type);
}

function clearMessageStorage() {
  localStorage.removeItem("messageText");
  localStorage.removeItem("messageColor");
  localStorage.removeItem("messageType");
}

// Mostrar carrito
function renderCart() {
  if (!cartItemsDiv || !totalDiv) return;

  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    showMessage("");
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.textContent = "";
    cartActions.classList.add("hidden");
    updateCartCount();
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

  //  Refrescar contador
  updateCartCount();
}

// Mostrar un solo ítem del carrito
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

// Eliminar producto del carrito
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showMessage("Item removed from cart.", "orange", "cart");
  renderCart();
}

// Vaciar el carrito
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  showMessage("Cart cleared.", "red", "cart");
  renderCart();
}

//  Contador reutilizable
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (countSpan) {
    countSpan.textContent = cart.length;
  }
}

// Detectar clics para eliminar
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    removeItem(index);
  }
});

// Inicializar carrito
document.addEventListener("DOMContentLoaded", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart();
});

// Botón para mostrar modal de pago
purchaseBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Cerrar modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Confirmar pago
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const selectedOption = paymentForm.querySelector('input[name="method"]:checked');
  const paymentMethod = selectedOption ? selectedOption.parentElement.textContent.trim() : "Not specified";

  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  modal.style.display = "none";
  confirmationMessage.classList.remove("hidden");

  selectedPaymentMethod.textContent = `Payment method: ${paymentMethod}`;
  orderNumber.textContent = `Order number: ${orderId}`;

  localStorage.removeItem("cart");
  cart = [];
  renderCart();

  confirmationMessage.scrollIntoView({ behavior: "smooth" });
});

// Ir a partes
goToPartsBtn.addEventListener("click", () => {
  confirmationMessage.classList.add("hidden");
  window.location.href = "../paginas/partes.html";
});

// Botón para vaciar
clearCartBtn.addEventListener("click", clearCart);
