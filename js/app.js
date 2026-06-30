// app.js — main entry point. Loads products, sets up all event listeners.

document.addEventListener('DOMContentLoaded', () => {
  // Apply theme immediately to avoid flash of wrong theme
  applyDarkModePreference();

  // Restore cart/wishlist badge counts before any interaction
  refreshCartUI();
  refreshWishlistUI();

  initApp();
});

async function initApp() {
  showLoadingState();

  try {
    const products = await fetchProducts();
    allProducts = products;
    onProductsLoaded(products);
  } catch (error) {
    console.error('Failed to load products:', error);
    showErrorState();
  }
}

function showLoadingState() {
  document.getElementById('skeletonGrid').classList.remove('hidden');
  document.getElementById('productGrid').classList.add('hidden');
  document.getElementById('errorState').classList.add('hidden');
  document.getElementById('emptyState').classList.add('hidden');
  renderSkeletonGrid(document.getElementById('skeletonGrid'), 6);
}

function showErrorState() {
  document.getElementById('skeletonGrid').classList.add('hidden');
  document.getElementById('productGrid').classList.add('hidden');
  document.getElementById('emptyState').classList.add('hidden');
  document.getElementById('errorState').classList.remove('hidden');
}

function onProductsLoaded(products) {
  document.getElementById('skeletonGrid').classList.add('hidden');
  document.getElementById('errorState').classList.add('hidden');
  document.getElementById('productGrid').classList.remove('hidden');

  renderCategoryButtons(products);
  applyAllFiltersAndRender();
  setupEventListeners();
}

/**
 * Attaches all event listeners once, using delegation where useful
 * so dynamically rendered cards still respond to clicks.
 */
function setupEventListeners() {
  // Retry button
  document.getElementById('retryBtn').addEventListener('click', initApp);

  // Search input — debounced 300ms
  const debouncedSearch = debounce((value) => {
    currentSearchTerm = value;
    applyAllFiltersAndRender();
  }, 300);

  document.getElementById('searchInput').addEventListener('input', (event) => {
    debouncedSearch(event.target.value);
  });

  // Sort dropdown
  document.getElementById('sortSelect').addEventListener('change', (event) => {
    currentSortOption = event.target.value;
    applyAllFiltersAndRender();
  });

  // Category buttons (delegated)
  document.getElementById('categoryBar').addEventListener('click', (event) => {
    const chip = event.target.closest('.category-chip');
    if (!chip) return;

    currentCategory = chip.dataset.category;
    document.querySelectorAll('.category-chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    applyAllFiltersAndRender();
  });

  // Clear all filters
  document.getElementById('clearFiltersBtn').addEventListener('click', clearAllFilters);

  // Product grid clicks (delegated) — open modal, add to cart, toggle wishlist
  document.getElementById('productGrid').addEventListener('click', handleProductGridClick);
  document.getElementById('wishlistGrid').addEventListener('click', handleProductGridClick);

  // Product modal close
  document.getElementById('closeProductModal').addEventListener('click', closeProductModal);
  document.getElementById('productModalOverlay').addEventListener('click', (event) => {
    if (event.target.id === 'productModalOverlay') closeProductModal();
  });

  // Checkout modal close
  document.getElementById('closeCheckoutModal').addEventListener('click', closeCheckoutModal);
  document.getElementById('checkoutModalOverlay').addEventListener('click', (event) => {
    if (event.target.id === 'checkoutModalOverlay') closeCheckoutModal();
  });

  // Escape key closes any open modal
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeProductModal();
      closeCheckoutModal();
    }
  });

  // Cart drawer
  document.getElementById('cartBtn').addEventListener('click', openCartDrawer);
  document.getElementById('closeCartDrawer').addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay').addEventListener('click', closeCartDrawer);
  document.getElementById('cartItemsContainer').addEventListener('click', handleCartItemClick);
  document.getElementById('checkoutBtn').addEventListener('click', openCheckoutModal);

  // Wishlist button opens wishlist view
  document.getElementById('wishlistBtn').addEventListener('click', () => switchView('wishlist'));

  // Nav links
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      switchView(link.dataset.view);
    });
  });

  // Hamburger menu
  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('mainNav').classList.toggle('open');
  });

  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
}

/**
 * Handles clicks anywhere inside a product grid: opening the modal,
 * adding to cart directly, or toggling wishlist — without one action
 * triggering another.
 */
function handleProductGridClick(event) {
  const wishlistBtn = event.target.closest('[data-action="wishlist"]');
  const addCartBtn = event.target.closest('[data-action="add-cart"]');
  const card = event.target.closest('.product-card');

  if (!card) return;
  const productId = Number(card.dataset.id);
  const product = allProducts.find((p) => p.id === productId) || wishlistItems.find((p) => p.id === productId);
  if (!product) return;

  if (wishlistBtn) {
    toggleWishlist(product);
    wishlistBtn.classList.toggle('active');
    wishlistBtn.querySelector('i').className = isInWishlist(productId) ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    return;
  }

  if (addCartBtn) {
    addToCart(product, 1);
    showToast(`Added "${product.title.slice(0, 24)}..." to cart`);
    return;
  }

  openProductModal(product);
}

/**
 * Handles clicks within the cart drawer: increase, decrease, remove.
 */
function handleCartItemClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const productId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'increase') increaseCartItemQty(productId);
  if (action === 'decrease') decreaseCartItemQty(productId);
  if (action === 'remove') removeFromCart(productId);
}
