// products.js — builds HTML for product cards, skeletons, and modal content

const PLACEHOLDER_IMG = 'https://via.placeholder.com/300x300?text=No+Image';

/**
 * Builds the star icon markup for a given rating value (0-5).
 */
function buildStarIcons(rating) {
  const fullStars = Math.round(rating);
  let starsHtml = '';

  for (let i = 1; i <= 5; i++) {
    starsHtml += i <= fullStars
      ? '<i class="fa-solid fa-star"></i>'
      : '<i class="fa-regular fa-star"></i>';
  }

  return starsHtml;
}

/**
 * Returns markup for a single product card.
 */
function renderProductCard(product) {
  const isWished = isInWishlist(product.id);
  const heartClass = isWished ? 'wishlist-heart active' : 'wishlist-heart';
  const heartIcon = isWished ? 'fa-solid fa-heart' : 'fa-regular fa-heart';

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="card-img-wrap">
        <span class="category-badge">${product.category}</span>
        <button class="${heartClass}" data-action="wishlist" data-id="${product.id}" aria-label="Toggle wishlist">
          <i class="${heartIcon}"></i>
        </button>
        <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';" />
      </div>
      <div class="card-body">
        <h3 class="card-title">${product.title}</h3>
        <div class="star-rating">
          ${buildStarIcons(product.rating.rate)}
          <span class="count">(${product.rating.count})</span>
        </div>
        <div class="card-price-row">
          <span class="card-price">$${product.price.toFixed(2)}</span>
          <button class="add-cart-btn" data-action="add-cart" data-id="${product.id}">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renders a list of products into a given container element.
 */
function renderProductList(products, containerEl) {
  if (products.length === 0) {
    containerEl.innerHTML = '';
    return;
  }
  containerEl.innerHTML = products.map(renderProductCard).join('');
}

/**
 * Builds one skeleton placeholder card.
 */
function renderSkeletonCard() {
  return `
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line title2"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-price-row">
          <div class="skeleton-line short"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Fills the skeleton grid with a given number of placeholder cards.
 */
function renderSkeletonGrid(containerEl, count = 6) {
  const cards = [];
  for (let i = 0; i < count; i++) {
    cards.push(renderSkeletonCard());
  }
  containerEl.innerHTML = cards.join('');
}

/**
 * Builds the full markup for the product detail modal body.
 */
function renderProductModalContent(product) {
  const isWished = isInWishlist(product.id);
  const heartIcon = isWished ? 'fa-solid fa-heart' : 'fa-regular fa-heart';

  return `
    <div class="product-modal-grid">
      <div class="modal-img-wrap">
        <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';" />
      </div>
      <div class="modal-info">
        <span class="category-badge" style="position:static;display:inline-block;">${product.category}</span>
        <h2>${product.title}</h2>
        <div class="modal-rating">
          <span class="star-rating">${buildStarIcons(product.rating.rate)}</span>
          ${product.rating.rate.toFixed(1)} stars · ${product.rating.count} reviews
        </div>
        <p class="modal-desc">${product.description}</p>
        <div class="modal-price">$${product.price.toFixed(2)}</div>

        <div class="qty-selector">
          <button class="qty-btn" id="modalQtyMinus"><i class="fa-solid fa-minus"></i></button>
          <span class="qty-value" id="modalQtyValue">1</span>
          <button class="qty-btn" id="modalQtyPlus"><i class="fa-solid fa-plus"></i></button>
        </div>

        <button class="primary-btn" id="modalAddCartBtn" style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>

        <button class="icon-btn ${isWished ? 'active' : ''}" id="modalWishlistBtn" style="margin-top:14px;color:${isWished ? 'var(--danger)' : 'var(--text-secondary)'};">
          <i class="${heartIcon}"></i> ${isWished ? 'Saved to Wishlist' : 'Save to Wishlist'}
        </button>
      </div>
    </div>
  `;
}
