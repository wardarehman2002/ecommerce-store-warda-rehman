// cart.js — shopping cart and wishlist logic, all backed by localStorage

const CART_STORAGE_KEY = 'shopease_cart';
const WISHLIST_STORAGE_KEY = 'shopease_wishlist';

let cartItems = loadCartFromStorage();
let wishlistItems = loadWishlistFromStorage();

/* ---------------- STORAGE HELPERS ---------------- */

function loadCartFromStorage() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCartToStorage() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function loadWishlistFromStorage() {
  const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveWishlistToStorage() {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
}

/* ---------------- CART OPERATIONS ---------------- */

/**
 * Adds a product to the cart with the given quantity.
 * If it already exists, increases its quantity instead of duplicating.
 */
function addToCart(product, quantity = 1) {
  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
    });
  }

  saveCartToStorage();
  refreshCartUI();
}

/**
 * Increases the quantity of a cart item by 1.
 */
function increaseCartItemQty(productId) {
  const item = cartItems.find((cartItem) => cartItem.id === productId);
  if (!item) return;
  item.quantity += 1;
  saveCartToStorage();
  refreshCartUI();
}

/**
 * Decreases quantity by 1, but never below 1 (minus button never deletes).
 */
function decreaseCartItemQty(productId) {
  const item = cartItems.find((cartItem) => cartItem.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity - 1);
  saveCartToStorage();
  refreshCartUI();
}

/**
 * Fully removes an item from the cart regardless of quantity.
 */
function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  saveCartToStorage();
  refreshCartUI();
}

/**
 * Empties the cart entirely (used after checkout).
 */
function clearCart() {
  cartItems = [];
  saveCartToStorage();
  refreshCartUI();
}

/**
 * Returns total number of individual items in the cart.
 */
function getCartItemCount() {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Returns the cart subtotal as a number.
 */
function getCartSubtotal() {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

/* ---------------- WISHLIST OPERATIONS ---------------- */

function isInWishlist(productId) {
  return wishlistItems.some((item) => item.id === productId);
}

/**
 * Adds or removes a product from the wishlist depending on its current state.
 */
function toggleWishlist(product) {
  if (isInWishlist(product.id)) {
    wishlistItems = wishlistItems.filter((item) => item.id !== product.id);
  } else {
    wishlistItems.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
      description: product.description,
    });
  }
  saveWishlistToStorage();
  refreshWishlistUI();
}
