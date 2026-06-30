// filters.js — search, category filter, sort, and a debounce helper built with a closure

let allProducts = [];
let currentCategory = 'all';
let currentSearchTerm = '';
let currentSortOption = 'default';

/**
 * Creates a debounced version of a function using a closure
 * to hold the timer reference between calls. No external library used.
 */
function debounce(callback, delay) {
  let timerId;

  return function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}

/**
 * Builds the list of unique categories from the loaded products
 * (never hardcoded in HTML).
 */
function getUniqueCategories(products) {
  const categories = products.map((product) => product.category);
  return [...new Set(categories)];
}

/**
 * Applies search term filtering, case-insensitive.
 */
function applySearchFilter(products, term) {
  if (!term) return products;
  const lowerTerm = term.toLowerCase();
  return products.filter((product) => product.title.toLowerCase().includes(lowerTerm));
}

/**
 * Applies category filtering. 'all' returns everything unchanged.
 */
function applyCategoryFilter(products, category) {
  if (category === 'all') return products;
  return products.filter((product) => product.category === category);
}

/**
 * Applies sorting based on the selected dropdown option.
 * Returns a new sorted array — never mutates the original.
 */
function applySort(products, sortOption) {
  const sorted = [...products];

  switch (sortOption) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
    case 'name-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

/**
 * Runs search, category filter, and sort together on the master product list,
 * then renders the result and updates the UI (count, empty state, etc).
 */
function applyAllFiltersAndRender() {
  let result = applySearchFilter(allProducts, currentSearchTerm);
  result = applyCategoryFilter(result, currentCategory);
  result = applySort(result, currentSortOption);

  const productGrid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  const productCount = document.getElementById('productCount');

  productCount.textContent = `Showing ${result.length} product${result.length !== 1 ? 's' : ''}`;

  if (result.length === 0) {
    productGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    productGrid.classList.remove('hidden');
    renderProductList(result, productGrid);
  }
}

/**
 * Resets search, category, and sort back to defaults in one action.
 */
function clearAllFilters() {
  currentSearchTerm = '';
  currentCategory = 'all';
  currentSortOption = 'default';

  document.getElementById('searchInput').value = '';
  document.getElementById('sortSelect').value = 'default';

  document.querySelectorAll('.category-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.category === 'all');
  });

  applyAllFiltersAndRender();
}

/**
 * Builds category filter buttons dynamically from the product data.
 */
function renderCategoryButtons(products) {
  const categoryBar = document.getElementById('categoryBar');
  const categories = getUniqueCategories(products);

  const allButton = `<button class="category-chip active" data-category="all">All</button>`;
  const categoryButtons = categories
    .map((category) => `<button class="category-chip" data-category="${category}">${category}</button>`)
    .join('');

  categoryBar.innerHTML = allButton + categoryButtons;
}
