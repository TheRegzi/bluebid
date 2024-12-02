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
