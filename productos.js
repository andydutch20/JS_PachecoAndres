// Array con todos los productos definidos en JavaScript
const products = [
  // Productos de la categoría "partes"
  {
    id: "p1",
    name: "Cuadro colony v1",
    price: 120,
    image: "/partes-bmx/cuadro-colony1.jpg",
    category: "partes"
  },
  {
    id: "p2",
    name: "Cuadro colony v2",
    price: 150,
    image: "/partes-bmx/cuadro-colony.jpg",
    category: "partes"
  },
  {
    id: "p3",
    name: " Cuadro fit miller",
    price: 90,
    image: "../partes-bmx/cuadro-fit-miller-2.webp",
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

// Ejecutar al cargar el archivo
initProductPage();

// Inicializa la página de productos dependiendo del archivo HTML abierto
function initProductPage() {
  const page = window.location.pathname.split("/").pop();

  if (page === "partes.html") {
    renderProducts("partes");
  } else if (page === "bicis-completas.html") {
    renderProducts("bicis");
  }

  updateCartCount();
}

// Renderiza los productos según su categoría
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

  // Asociar evento click a los botones después de renderizar
  const buttons = container.querySelectorAll(".add-to-cart");
  buttons.forEach(button => {
    button.addEventListener("click", () => addToCart(button));
  });
}

// Agrega un producto al carrito validando sesión y duplicados
function addToCart(button) {
  const user = sessionStorage.getItem("loggedInUser");
  if (!user) {
    showAlert("You must log in to add products to the cart.", "warning");
    return;
  }

  const productDiv = button.parentElement;
  const id = productDiv.getAttribute("data-id");
  const name = productDiv.getAttribute("data-name");
  const price = parseFloat(productDiv.getAttribute("data-price"));
  const image = productDiv.getAttribute("data-image");

  if (isNaN(price)) {
    showAlert("Invalid product price.", "error");
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
  updateCartCount();

  showAlert(`"${name}" added to cart!`, "success");
}

// Muestra una alerta visual usando SweetAlert
function showAlert(message, icon = "info") {
  Swal.fire({
    text: message,
    icon: icon,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: "top-end"
  });
}

// Actualiza el contador del carrito visualmente con animación
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (countSpan) {
    countSpan.textContent = totalItems;
    countSpan.classList.add("animate");

    setTimeout(() => {
      countSpan.classList.remove("animate");
    }, 300);
  }
}

