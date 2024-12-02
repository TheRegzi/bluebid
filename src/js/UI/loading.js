export function displayLoading() {
  const loading = document.getElementById('loading');
  loading.classList.remove('hidden');
}

export function hideLoading() {
  const loading = document.getElementById('loading');
  loading.classList.add('hidden');
}
