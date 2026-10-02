// ==========================================================================
// PRODUCT DATABASE (MOCK DATA)
// ==========================================================================
const productsData = [
  {
    id: 1,
    title: "Heavyweight Acid Hoodie",
    category: "hoodies",
    price: 110.00,
    tag: "LIMITED DROP",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    description: "500 GSM French Terry Cotton. Custom boxy fit with washed acid finish and reinforced double-stitching throughout.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    title: "Tactical Cyber Cargo",
    category: "pants",
    price: 135.00,
    tag: "RESTOCKED",
    image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop",
    description: "Water-resistant ripstop nylon, multi-pocket modular setup with adjustable magnetic buckle straps.",
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: 3,
    title: "Distressed Graphic Tee",
    category: "tees",
    price: 65.00,
    tag: "HOT",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    description: "280 GSM combed cotton. Screenprinted jumbo front graphic with hand-distressed collar collar and hem.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 4,
    title: "Nocturnal Cyber Puffer",
    category: "hoodies",
    price: 220.00,
    tag: "EXCLUSIVE",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    description: "Matte black thermal insulation jacket with hidden magnetic closures and reflective arm logo print.",
    sizes: ["M", "L", "XL"]
  }
];

// Cart State
let cart = [];

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const productsGrid = document.getElementById("productsGrid");
const quickViewModal = document.getElementById("quickViewModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalBody = document.getElementById("modalBody");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartBadge = document.getElementById("cartBadge");
const cartCountHeader = document.getElementById("cartCountHeader");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartSubtotal = document.getElementById("cartSubtotal");

// ==========================================================================
// INITIALIZATION & EVENT LISTENERS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(productsData);
  setupFilters();
  setupEventListeners();
});

// Render Products Grid
function renderProducts(products) {
  productsGrid.innerHTML = "";
  
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrap">
        <span class="product-tag">${product.tag}</span>
        <img src="${product.image}" alt="${product.title}">
        <button class="quick-view-btn" onclick="openQuickView(${product.id})">QUICK VIEW</button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// Filter Functionality
function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const category = btn.getAttribute("data-category");
      if (category === "all") {
        renderProducts(productsData);
      } else {
        const filtered = productsData.filter(p => p.category === category);
        renderProducts(filtered);
      }
    });
  });
}

// Quick View Modal Logic
window.openQuickView = function(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  modalBody.innerHTML = `
    <div class="modal-grid">
      <div class="modal-img-wrap">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="modal-details">
        <h2 class="modal-title">${product.title}</h2>
        <div class="modal-price">$${product.price.toFixed(2)}</div>
        <p class="modal-desc">${product.description}</p>
        
        <div class="size-selector">
          <div class="selector-title">SELECT SIZE</div>
          <div class="size-options">
            ${product.sizes.map((s, index) => `<button class="size-btn ${index === 1 ? 'active' : ''}">${s}</button>`).join('')}
          </div>
        </div>

        <button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">ADD TO BAG</button>
      </div>
    </div>
  `;

  quickViewModal.classList.add("active");
};

function closeModal() {
  quickViewModal.classList.remove("active");
}

// Cart Logic
window.addToCart = function(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1, selectedSize: "M" });
  }

  updateCartUI();
  closeModal();
  openCartDrawer();
};

window.removeFromCart = function(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
};

function updateCartUI() {
  // Update Counts
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.innerText = totalItems;
  cartCountHeader.innerText = totalItems;

  // Render Items
  cartItemsContainer.innerHTML = "";
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">YOUR BAG IS EMPTY</p>`;
  } else {
    cart.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">SIZE: ${item.selectedSize} | QTY: ${item.quantity}</div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <button class="remove-item-btn" onclick="removeFromCart(${item.id})">REMOVE</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  // Calculate Subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartSubtotal.innerText = `$${subtotal.toFixed(2)}`;
}

function openCartDrawer() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
}

// Event Listeners setup
function setupEventListeners() {
  closeModalBtn.addEventListener("click", closeModal);
  quickViewModal.addEventListener("click", (e) => {
    if (e.target === quickViewModal) closeModal();
  });

  openCartBtn.addEventListener("click", openCartDrawer);
  closeCartBtn.addEventListener("click", closeCartDrawer);
  cartOverlay.addEventListener("click", closeCartDrawer);
}