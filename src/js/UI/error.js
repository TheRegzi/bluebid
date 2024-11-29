export function displayError(message) {
  if (error) {
    error.innerHTML =
      `<i class="fa-solid fa-triangle-exclamation"></i> ` + message;
    error.classList.add(
      'text-red-500',
      'mt-4',
      'font-medium',
      'text-sm',
      'text-center'
    );
  }
}
