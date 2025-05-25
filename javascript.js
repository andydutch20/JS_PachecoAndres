// Funcion de agregar productos al carrito

function addToCart(button) {
  const productDiv = button.parentElement;
  const id = productDiv.getAttribute("data-id");
  const name = productDiv.getAttribute("data-name");
  const price = productDiv.getAttribute("data-price");
  const image = productDiv.getAttribute("data-image");

  const product = { id, name, price, image };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`${name} added to cart!`);
}

// Contenido en pagina de carrito

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsDiv = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total");

  if (cartItemsDiv && totalDiv) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
        total += Number(item.price);
      });

      totalDiv.textContent = `Total: $${total}`;

      // Buton de limpiar el carrito


      const clearBtn = document.createElement("button");
      clearBtn.textContent = "Clear Cart";
      clearBtn.onclick = clearCart;
      totalDiv.appendChild(document.createElement("br"));
      totalDiv.appendChild(clearBtn);
    }
  }
});

// Remover productos del carrito


function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload(); 
}

// Limpiar el carrito completo


function clearCart() {
  localStorage.removeItem("cart");
  location.reload(); 
}
