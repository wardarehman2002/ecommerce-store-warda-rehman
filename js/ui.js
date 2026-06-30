// ui.js — modal handling, cart drawer, dark mode, toast notifications

let activeModalProduct = null;
let modalQuantity = 1;

/* ---------------- TOAST ---------------- */

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 1800);
}

/* ---------------- PRODUCT MODAL ---------------- */

function openProductModal(product) {
  activeModalProduct = product;
  modalQuantity = 1;

  const overlay = document.getElementById('productModalOverlay');
  const body = document.getElementById('productModalBody');
  body.innerHTML = renderProductModalContent(product);

  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.add('show'));
  document.body.style.overflow = 'hidden';

  document.getElementById('modalQtyMinus').addEventListener('click', () => updateModalQty(-1));
  document.getElementById('modalQtyPlus').addEventListener('click', () => updateModalQty(1));
  document.getElementById('modalAddCartBtn').addEventListener('click', () => {
    addToCart(activeModalProduct, modalQuantity);
    showToast(`Added ${modalQuantity} × ${activeModalProduct.title.slice(0, 24)}... to cart`);
    closeProductModal();
  });
  document.getElementById('modalWishlistBtn').addEventListener('click', () => {
    toggleWishlist(activeModalProduct);
    openProductModal(activeModalProduct); // re-render to reflect new state
  });
}

function updateModalQty(delta) {
  modalQuantity = Math.max(1, modalQuantity + delta);
  document.getElementById('modalQtyValue').textContent = modalQuantity;
}

function closeProductModal() {
  const overlay = document.getElementById('productModalOverlay');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(() => overlay.classList.add('hidden'), 250);
  activeModalProduct = null;
}

/* ---------------- CHECKOUT MODAL ---------------- */

function openCheckoutModal() {
  const overlay = document.getElementById('checkoutModalOverlay');
  const body = document.getElementById('checkoutModalBody');

  const itemsHtml = cartItems
    .map(
      (item) => `
      <div class="checkout-item-row">
        <span>${item.title.slice(0, 30)}${item.title.length > 30 ? '...' : ''} × ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>`
    )
    .join('');

  body.innerHTML = `
    <i class="fa-solid fa-circle-check success-icon"></i>
    <h2>Order Confirmed!</h2>
    <p style="color:var(--text-secondary);">Thank you for your purchase. Here's your order summary:</p>
    <div class="checkout-items-list">
      ${itemsHtml}
      <div class="checkout-total-row">
        <span>Total</span>
        <span>$${getCartSubtotal().toFixed(2)}</span>
      </div>
    </div>
    <button class="primary-btn" id="closeCheckoutConfirmBtn">Continue Shopping</button>
  `;

  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.add('show'));

  document.getElementById('closeCheckoutConfirmBtn').addEventListener('click', closeCheckoutModal);

  clearCart();
  closeCartDrawer();
}

function closeCheckoutModal() {
  const overlay = document.getElementById('checkoutModalOverlay');
  overlay.classList.remove('show');
  setTimeout(() => overlay.classList.add('hidden'), 250);
}

/* ---------------- CART DRAWER ---------------- */

function renderCartItem(item) {
  return `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';" />
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-controls">
          <button class="cart-qty-btn" data-action="decrease" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
          <span class="qty-value">${item.quantity}</span>
          <button class="cart-qty-btn" data-action="increase" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
          <button class="cart-remove-btn" data-action="remove" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
  `;
}

function refreshCartUI() {
  const container = document.getElementById('cartItemsContainer');
  const footer = document.getElementById('cartFooter');
  const badge = document.getElementById('cartBadge');

  const count = getCartItemCount();
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button class="primary-btn" id="continueShoppingBtn">Continue Shopping</button>
      </div>
    `;
    footer.classList.add('hidden');
    document.getElementById('continueShoppingBtn').addEventListener('click', closeCartDrawer);
  } else {
    container.innerHTML = cartItems.map(renderCartItem).join('');
    footer.classList.remove('hidden');
    document.getElementById('cartSubtotal').textContent = `$${getCartSubtotal().toFixed(2)}`;
  }
}

function openCartDrawer() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.remove('hidden');
  requestAnimationFrame(() => document.getElementById('cartOverlay').classList.add('show'));
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  const overlay = document.getElementById('cartOverlay');
  overlay.classList.remove('show');
  setTimeout(() => overlay.classList.add('hidden'), 300);
}

/* ---------------- WISHLIST UI ---------------- */

function refreshWishlistUI() {
  const badge = document.getElementById('wishlistBadge');
  const navCount = document.getElementById('wishlistNavCount');
  const grid = document.getElementById('wishlistGrid');
  const emptyState = document.getElementById('wishlistEmptyState');

  const count = wishlistItems.length;
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
  navCount.textContent = count;
  navCount.classList.toggle('hidden', count === 0);

  if (count === 0) {
    grid.classList.add('hidden');
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    grid.classList.remove('hidden');
    renderProductList(wishlistItems, grid);
  }
}

/* ---------------- VIEW SWITCHING ---------------- */

function switchView(viewName) {
  document.getElementById('storeView').classList.toggle('hidden', viewName !== 'store');
  document.getElementById('wishlistView').classList.toggle('hidden', viewName !== 'wishlist');

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === viewName);
  });

  document.getElementById('mainNav').classList.remove('open');

  if (viewName === 'wishlist') {
    refreshWishlistUI();
  }
}

/* ---------------- DARK MODE ---------------- */

function applyDarkModePreference() {
  const isDark = localStorage.getItem('shopease_theme') === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  updateDarkModeIcon(isDark);
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('shopease_theme', isDark ? 'dark' : 'light');
  updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
  const icon = document.querySelector('#darkModeToggle i');
  icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}
