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

  const cartItemsDiv = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total");

  if (cartItemsDiv && totalDiv) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    showMessage("Cart loaded from localStorage.", "green");

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
      totalDiv.textContent = "";
    } else {
      let total = 0;

      cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}" style="width: 100px; height: auto;">
          <p><strong>${item.name}</strong> - $${item.price}</p>
          <button onclick="removeItem(${index})">Remove</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
        total += item.price;
      });

      totalDiv.textContent = `Total: $${total}`;

      const clearBtn = document.createElement("button");
      clearBtn.textContent = "Clear Cart";
      clearBtn.onclick = clearCart;
      totalDiv.appendChild(document.createElement("br"));
      totalDiv.appendChild(clearBtn);
    }
  }
});

// Remove individual item
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showMessage("Item removed.", "orange");
  location.reload();
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem("cart");
  showMessage("Cart cleared.", "red");
  location.reload();
}
