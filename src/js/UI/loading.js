/**
 * Displays the loading indicator by removing the `hidden` class from the element with the ID `loading`.
 * Ensures the loading element exists in the DOM before trying to modify it.
 */

export function displayLoading() {
  const loading = document.getElementById('loading');
  loading.classList.remove('hidden');
}

/**
 * Hides the loading indicator by adding the `hidden` class to the element with the ID `loading`.
 * Ensures the loading element exists in the DOM before trying to modify it.
 */

export function hideLoading() {
  const loading = document.getElementById('loading');
  loading.classList.add('hidden');
}
