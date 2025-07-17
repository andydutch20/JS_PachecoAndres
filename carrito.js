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

init(); // Inicializar al cargar el script

function init() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart();
  updateCartCount();

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

    Swal.fire({
      icon: 'success',
      title: 'Purchase completed!',
      html: `<strong>${paymentMethod}</strong><br>Order number: <code>${orderId}</code>`,
      confirmButtonColor: '#3085d6'
    });
  });

  goToPartsBtn?.addEventListener("click", () => {
    confirmationMessage.classList.add("hidden");
    window.location.href = "../paginas/partes.html";
  });

  clearCartBtn?.addEventListener("click", clearCart);
}

function renderCart() {
  if (!cartItemsDiv || !totalDiv) return;
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.textContent = "";
    cartActions.classList.add("hidden");
    updateCartCount();

    Swal.fire({
      icon: 'info',
      title: 'Cart is empty',
      text: 'No products have been added yet.',
      timer: 2000,
      showConfirmButton: false
    });

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
  const removedItem = cart[index].name;
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();

  Swal.fire({
    icon: 'warning',
    title: `"${removedItem}" removed from cart.`,
    timer: 1500,
    showConfirmButton: false
  });
}

function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  renderCart();

  Swal.fire({
    icon: 'warning',
    title: 'Cart cleared',
    timer: 1500,
    showConfirmButton: false
  });
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
    Swal.fire({
      icon: 'error',
      title: 'Login required',
      text: 'You must log in to add products to the cart.',
      confirmButtonColor: '#d33'
    });
    return;
  }

  const productDiv = button.parentElement;
  const id = productDiv.getAttribute("data-id");
  const name = productDiv.getAttribute("data-name");
  const price = parseFloat(productDiv.getAttribute("data-price"));
  const image = productDiv.getAttribute("data-image");

  if (isNaN(price)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid price',
      text: 'Error: Invalid product price.',
      confirmButtonColor: '#d33'
    });
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
  updateCartCount();

  Swal.fire({
    icon: 'success',
    title: 'Added to cart',
    text: `"${name}" has been added!`,
    timer: 1500,
    showConfirmButton: false
  });
}
