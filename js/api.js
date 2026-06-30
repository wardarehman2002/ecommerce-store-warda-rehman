// api.js — handles all communication with the FakeStore API

const API_URL = 'https://fakestoreapi.com/products';

/**
 * Fetches all products from the API.
 * Throws an error if the network request fails or response is not ok,
 * so the caller can show the error UI and offer a retry.
 */
async function fetchProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data;
}
