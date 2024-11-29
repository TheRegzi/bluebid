import { API_AUTH_LOGIN } from '../constants';
import { displayError } from '../../UI/error';

export async function login({ email, password }) {
  const apiUrl = API_AUTH_LOGIN;

  try {
    const url = new URL(apiUrl);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.errors?.[0]?.message || errorData.message || 'Login failed';

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

export async function onLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const loginData = {
    email: email,
    password: password,
  };

  try {
    const response = await login(loginData);
    const userToken = response.data.accessToken;
    const name = response.data.name;

    if (userToken) {
      localStorage.setItem('userToken', userToken);
      localStorage.setItem('name', name);

      console.log('Login successful!');
      window.location.href = '/index.html';
    } else {
      console.log('User Token not found in response:', response);
      displayError(
        'Login failed. User not found. Please check your username and try again.'
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    displayError(
      'Login failed. User not found. Please check your username and try again.'
    );
  }
}
