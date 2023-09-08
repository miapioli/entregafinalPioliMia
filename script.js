document.addEventListener("DOMContentLoaded", () => {
  const modoOscuroButton = document.getElementById("modoOscuro");
  const body = document.body;

  const modoOscuroActivado = localStorage.getItem("modoOscuro") === "true";

  if (modoOscuroActivado) {
    body.classList.add("modo-oscuro");
    modoOscuroButton.textContent = "Modo Claro";
  } else {
    body.classList.remove("modo-oscuro");
    modoOscuroButton.textContent = "Modo Oscuro";
  }

  modoOscuroButton.addEventListener("click", () => {
    body.classList.toggle("modo-oscuro");

    if (body.classList.contains("modo-oscuro")) {
      localStorage.setItem("modoOscuro", "true");
      modoOscuroButton.textContent = "Modo Claro";
    } else {
      localStorage.setItem("modoOscuro", "false");
      modoOscuroButton.textContent = "Modo Oscuro";
    }
  });

  const swiper = new Swiper(".swiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });

  const productList = document.getElementById("product-list");
  const sortSelect = document.getElementById("sort-select");
  const offerCheckbox = document.getElementById("offer-checkbox");
  const toggleCartButton = document.getElementById("toggle-cart-button");
  const clearCartButton = document.getElementById("clear-cart");

  let cartVisible = false;
  let cart = [];

  function loadCartFromLocalStorage() {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      cart = JSON.parse(cartData);
      updateCart();
    }
  }

  function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  toggleCartButton.addEventListener("click", () => {
    cartVisible = !cartVisible;
    const cart = document.querySelector(".cart");
    if (cartVisible) {
      cart.style.display = "block";
    } else {
      cart.style.display = "none";
    }
  });

  let cartItems = document.getElementById("cart-items");

  function updateCart() {
    cartItems.innerHTML = "";

    cart.forEach((product) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.textContent = `${product.nombre} - $${product.precio}`;
      cartItems.appendChild(cartItem);
    });

    saveCartToLocalStorage();
  }

  async function loadProducts() {
    try {
      const response = await fetch("anime.json");
      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo JSON.");
      }
      products = await response.json();
      renderProducts();
    } catch (error) {
      console.error("Error al cargar o procesar el archivo JSON:", error);
    }
  }

  function renderProducts() {
    productList.innerHTML = "";

    let filteredProducts = [...products.anime];

    if (sortSelect.value === "asc") {
      filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (sortSelect.value === "desc") {
      filteredProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    if (offerCheckbox.checked) {
      filteredProducts = filteredProducts.filter((product) => product.oferta);
    }

    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      const productImage = document.createElement("img");

      if (product.imagen !== false) {
        productImage.src = product.imagen;
        productImage.alt = product.nombre;
      } else {
        productImage.src = "img/imagen_no_disponible.png";
        productImage.alt = "Imagen no disponible";
      }

      productCard.appendChild(productImage);

      const productName = document.createElement("h3");
      productName.textContent = product.nombre;

      const productGenre = document.createElement("p");
      productGenre.textContent = `Género: ${product.genero}`;

      const productPrice = document.createElement("p");
      productPrice.textContent = `Precio: $${product.precio}`;

      const addToCartButton = document.createElement("button");
      addToCartButton.classList.add("add-to-cart");
      addToCartButton.setAttribute("data-id", product.id);
      addToCartButton.textContent = "Agregar al carrito";

      addToCartButton.addEventListener("click", () => {
        const productId = parseInt(addToCartButton.getAttribute("data-id"));
        const product = products.anime.find((item) => item.id === productId);

        if (product) {
          cart.push(product);
          updateCart();
          const notification = document.getElementById("notification");
          notification.style.display = "block";
          setTimeout(() => {
            notification.style.display = "none";
          }, 6000);
        }
      });

      productCard.appendChild(productName);
      productCard.appendChild(productGenre);
      productCard.appendChild(productPrice);
      productCard.appendChild(addToCartButton);

      productList.appendChild(productCard);
    });
  }

  sortSelect.addEventListener("change", renderProducts);
  offerCheckbox.addEventListener("change", renderProducts);

  clearCartButton.addEventListener("click", () => {
    cart = [];
    updateCart();
  });

  loadCartFromLocalStorage();

  loadProducts();
});

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const messageContainer = document.getElementById("message-container");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (!isValidEmail(email)) {
      messageContainer.textContent = "¡Error! ¡Ingresa un correo válido!";
      messageContainer.classList.add("error-message");
      return;
    }
    if (name.length < 3) {
      messageContainer.textContent =
        "¡Error! ¡El nombre debe tener al menos 3 caracteres!";
      messageContainer.classList.add("error-message");
      return;
    }
    messageContainer.textContent =
      "¡Muchas gracias por tu comentario! Nos estaremos comunicando uwu";
    messageContainer.classList.remove("error-message");
    messageContainer.classList.add("success-message");

    contactForm.reset();
  });

  function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailPattern.test(email);
  }
});
