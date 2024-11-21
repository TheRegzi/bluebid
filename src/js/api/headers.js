import { getKey } from './auth/api-key';

export async function headers() {
  const headers = new Headers();

  const apiKey = await getKey('My API Key Name');
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
