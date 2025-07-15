// Array con todos los productos definidos en JavaScript
const products = [
  // Productos de la categoría "partes"
  {
    id: "p1",
    name: "Manillar BMX",
    price: 120,
    image: "../partes bmx/cuadro colony 2.jpg",
    category: "partes"
  },
  {
    id: "p2",
    name: "Rines BMX",
    price: 150,
    image: "../partes bmx/cuadro colony.jpg",
    category: "partes"
  },
  {
    id: "p3",
    name: "Pedales BMX",
    price: 90,
    image: "../partes bmx/cuadro fit miller 2.webp",
    category: "partes"
  },
  // Bicis completas
  {
    id: "b1",
    name: "Fit Complete Bike",
    price: 500,
    image: "../bicis completas/fit complete bike.avif",
    category: "bicis"
  },
  {
    id: "b2",
    name: "King Complete Bike",
    price: 550,
    image: "../bicis completas/king complete bike.webp",
    category: "bicis"
  },
  {
    id: "b3",
    name: "Stolen Complete Bike",
    price: 480,
    image: "../bicis completas/stolen complete bike.webp",
    category: "bicis"
  }
];

//  Inicializar al cargar el script
initProductPage();

function initProductPage() {
  const page = window.location.pathname.split("/").pop();

  if (page === "partes.html") {
    renderProducts("partes");
  } else if (page === "bicis-completas.html") {
    renderProducts("bicis");
  }

  updateCartCount();

  const storedType = localStorage.getItem("messageType");
  if (storedType !== "product") showMessage("");
}

//  Renderizar productos por categoría
function renderProducts(category) {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";

  const filtered = products.filter(p => p.category === category);

  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.setAttribute("data-id", product.id);
    div.setAttribute("data-name", product.name);
    div.setAttribute("data-price", product.price);
    div.setAttribute("data-image", product.image);

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <p>${product.name} - $${product.price}</p>
      <button class="add-to-cart">Add to Cart</button>
    `;

    container.appendChild(div);
  });

  // Asociar eventos a botones después de renderizar
  const buttons = container.querySelectorAll(".add-to-cart");
  buttons.forEach(button => {
    button.addEventListener("click", () => addToCart(button));
  });
}

//  Agregar producto al carrito sin duplicados
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
    showMessage("Invalid product price.", "red", "product");
    return;
  }

  const newProduct = { id, name, price, image, quantity: 1 };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(p => p.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(newProduct);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showMessage(`"${name}" added to cart!`, "white", "product");
  updateCartCount();
}

// Mostrar mensaje temporal
function showMessage(text, color = "green", type = "product") {
  const msg = document.getElementById("message");
  if (!msg) return;

  msg.textContent = text;
  msg.style.color = color;
  msg.style.display = "block";

  localStorage.setItem("messageText", text);
  localStorage.setItem("messageColor", color);
  localStorage.setItem("messageType", type);

  setTimeout(() => {
    msg.style.display = "none";
    localStorage.removeItem("messageText");
    localStorage.removeItem("messageColor");
    localStorage.removeItem("messageType");
  }, 2500);
}

// Actualizar contador del carrito con animación
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (countSpan) {
    countSpan.textContent = totalItems;
    countSpan.classList.add("animate");
    setTimeout(() => countSpan.classList.remove("animate"), 300);
  }
}
