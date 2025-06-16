// Show messages in the DOM
function showMessage(text, color = "green") {
  const messageDiv = document.getElementById("message");
  if (messageDiv) {
    messageDiv.textContent = text;
    messageDiv.style.color = color;
    localStorage.setItem("messageText", text);
    localStorage.setItem("messageColor", color);
  }
}

// Restore previous message on page load
document.addEventListener("DOMContentLoaded", () => {
  const messageDiv = document.getElementById("message");
  const storedText = localStorage.getItem("messageText");
  const storedColor = localStorage.getItem("messageColor");
  if (messageDiv && storedText) {
    messageDiv.textContent = storedText;
    messageDiv.style.color = storedColor || "green";
  }
});

// Add product to cart
function addToCart(button) {
  const productDiv = button.parentElement;
  const id = productDiv.getAttribute("data-id");
  const name = productDiv.getAttribute("data-name");
  const price = parseFloat(productDiv.getAttribute("data-price"));
  const image = productDiv.getAttribute("data-image");

  const product = { id, name, price, image };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  showMessage(`${name} added to cart!`, "blue");
  alert(`${name} added to cart!`);
}
