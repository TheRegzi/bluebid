export async function headers() {
  const headers = new Headers();

  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
  const userToken = localStorage.getItem('userToken');

  headers.append('Content-Type', 'application/json');

  if (apiKey) {
    headers.append('X-Noroff-API-Key', apiKey);
  }

  if (userToken) {
    headers.append('Authorization', `Bearer ${userToken}`);
  }

  return headers;
}
