
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
const countSpan = document.getElementById("cart-count");
const messageDiv = document.getElementById("message");

init(); // Inicializar al cargar el script

function init() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart();
  updateCartCount();

  if (localStorage.getItem("messageType") !== "product") showMessage("");

  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach(button => {
    button.addEventListener("click", () => addToCart(button));
  });

  document.addEventListener("click", function (e) {
    const index = parseInt(e.target.getAttribute("data-index"));

    if (e.target.classList.contains("remove-btn")) removeItem(index);
    if (e.target.classList.contains("increase-btn")) increaseQuantity(index);
    if (e.target.classList.contains("decrease-btn")) decreaseQuantity(index);
  });

  purchaseBtn?.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModal?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  paymentForm?.addEventListener("submit", (e) => {
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

  goToPartsBtn?.addEventListener("click", () => {
    confirmationMessage.classList.add("hidden");
    window.location.href = "../paginas/partes.html";
  });

  clearCartBtn?.addEventListener("click", clearCart);
}

function showMessage(text, color = "green", type = "cart") {
  if (!messageDiv) return;
  messageDiv.textContent = text;
  messageDiv.style.color = color;
  messageDiv.style.display = "block";
  saveMessageToStorage(text, color, type);

  setTimeout(() => {
    messageDiv.style.display = "none";
    clearMessageStorage();
  }, 3000);
}

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

function renderCart() {
  if (!cartItemsDiv || !totalDiv) return;
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    showMessage("Cart is empty.", "white", "cart");
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.textContent = "";
    cartActions.classList.add("hidden");
    updateCartCount();
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    renderCartItem(item, index);
    total += item.price * item.quantity;
  });

  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
  if (paymentSummary) paymentSummary.textContent = `Total: $${total.toFixed(2)}`;
  cartActions.classList.remove("hidden");
  updateCartCount();
}

function renderCartItem(item, index) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "cart-item";
  itemDiv.innerHTML = `
    <img src="${item.image}" alt="${item.name}" style="width: 100px;">
    <p><strong>${item.name}</strong><br>$${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
    <div>
      <button class="decrease-btn" data-index="${index}">–</button>
      <button class="increase-btn" data-index="${index}">+</button>
    </div>
    <button class="remove-btn" data-index="${index}">Remove</button>
  `;
  cartItemsDiv.appendChild(itemDiv);
}

function increaseQuantity(index) {
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showMessage("Item removed from cart.", "orange", "cart");
  renderCart();
}

function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  showMessage("Cart cleared.", "red", "cart");
  renderCart();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countSpan) {
    countSpan.textContent = totalItems;
    countSpan.classList.add("animate");
    setTimeout(() => countSpan.classList.remove("animate"), 300);
  }
}

function addToCart(button) {
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
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showMessage(`"${name}" has been added to cart!`, "white", "product");
  updateCartCount();
}


