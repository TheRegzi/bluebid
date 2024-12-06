/**
 * Constructs and returns the headers needed for API requests.
 *
 * This function sets the `'Content-Type': 'application/json'` header for all requests.
 * If available, it also appends the API key and the user's authentication token from localStorage.
 *
 * - The API key (`X-Noroff-API-Key`) is imported from the .env file via import.meta.env.VITE_NOROFF_API_KEY;
 * - The Authorization token (`Bearer token`) is retrieved from localStorage.
 *
 * @returns {Headers} An instance of the Headers object to be used in API requests.
 *
 */

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
