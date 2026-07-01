# ShopEase — E-Commerce Product Store

ShopEase is a fully functional e-commerce product store built with vanilla HTML, CSS, and JavaScript. It fetches live product data from the FakeStore API and lets users browse, filter, search, sort, and purchase products entirely client-side using localStorage for persistence.

## Live Demo

 https://wardarehman2002.github.io/ecommerce-store-warda-rehman/ 

## Features

- Fetches 20 real products from `https://fakestoreapi.com/products` using `fetch()` + async/await
- Animated skeleton loading screen while data loads
- Styled error state with a "Try Again" retry button
- Fully responsive product grid (3 / 2 / 1 columns)
- Product cards with category badge, truncated title, star ratings, price, Add to Cart
- Live product count that updates with filters
- Real-time, case-insensitive search (debounced 300ms with a custom closure-based debounce function)
- Dynamically generated category filter buttons (no hardcoded categories)
- Sort by Price (Low→High, High→Low), Rating, and Name
- Search + category filter + sort all work together simultaneously
- "Clear All Filters" button
- Styled empty state when no products match filters
- Product detail modal with quantity selector, full description, and rating breakdown
- Modal closes via X button, outside click, or Escape key
- Shopping cart drawer (slide-in) with quantity controls, remove button, and live subtotal
- Checkout flow with an order confirmation modal; cart clears after checkout
- Cart and dark/light mode preference both persist via localStorage and restore on reload
- Dark / light mode toggle with no flash of incorrect theme on load
- Mobile hamburger menu and full-width cart drawer on small screens
- Bonus: Wishlist feature (heart icon + dedicated Wishlist view)
- Bonus: Debounced search using a closure

## Technologies Used

- HTML5 (semantic markup)
- CSS3 (Flexbox, Grid, CSS variables, animations, media queries)
- Vanilla JavaScript (ES6+, fetch/async-await, array methods, closures)
- Font Awesome (icons)
- Google Fonts (Poppins)
- FakeStore API (product data)

## How to Run Locally

1. Clone or download this repository.
2. No build step or dependencies required — it's pure HTML/CSS/JS.
3. Open `index.html` directly in a browser, **or** for best results run a local server, e.g.:
   ```
   npx serve .
   ```
   or with Python:
   ```
   python -m http.server 8000
   ```
4. Visit `http://localhost:8000` (or wherever your server runs) in your browser.

## What I Learned

The biggest challenge I faced was making search, category filter, 
and sort all work together at the same time without one resetting 
the other. I solved this by storing each filter value in a separate 
variable and running all three together in one function every time 
anything changed.

I also learned how to persist cart data using localStorage — saving 
the cart array as JSON on every update and restoring it on page load. 
The dark mode "no flash" problem taught me that I need to read 
localStorage and apply the theme before the page renders, not after.

Handling the product modal with keyboard (Escape key) and outside-click 
closing, and writing my own debounce function using closures for the 
search input were new concepts I implemented for the first time in 
this project.

## Screenshots

_Add at least 3 screenshots: desktop product grid, mobile view, and the cart drawer open._

Desktop View

<img width="796" height="4360" alt="desktop" src="https://github.com/user-attachments/assets/e00633da-1bb5-46fd-b3bb-e8a9135c7f57" />

Mobile View

<img width="768" height="553" alt="mobile" src="https://github.com/user-attachments/assets/0d8ceaff-2f9a-4b0a-9375-3b7a75b928a7" />

Cart Drawer View

<img width="1339" height="638" alt="cart " src="https://github.com/user-attachments/assets/c3dbc621-6cfc-4986-a926-51c92d873786" />

<img width="1349" height="644" alt="cart subtotal" src="https://github.com/user-attachments/assets/463d463d-20c9-4953-9703-96cfe5f891e0" />

## Video Walkthrough

https://www.loom.com/share/a4a961ebf16542668e77b22a83207ddb



