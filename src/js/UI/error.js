/**
 * Displays an error message in the HTML element with the ID `error`.
 * The message is styled and made visible to the user. This function is typically used
 * to provide user feedback when an error occurs in other functions.
 *
 * - If the element with ID `error` is not found in the DOM, logs an error message to the console.
 *
 * @param {string} message - The error message to be displayed to the user.
 * @returns {void} - This function does not return a value.
 */

export function displayError(message) {
  const errorElement = document.getElementById('error');
  if (errorElement) {
    errorElement.innerHTML =
      `<i class="fa-solid fa-triangle-exclamation"></i> ` + message;
    errorElement.classList.add(
      'text-red-500',
      'mt-4',
      'font-medium',
      'text-sm',
      'text-center'
    );
  } else {
    console.error('Error element not found in the DOM');
  }
}
