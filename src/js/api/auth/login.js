import { API_AUTH_LOGIN } from '../constants';
import { displayError } from '../../UI/error';
import { displayLoading, hideLoading } from '../../UI/loading';

/**
 * Function to login a user by their email and password, by sending a POST request to the login API.
 * If the response is not okay, it throws a login error with a message from the API or a default message.
 *
 * @async
 * @param {string} email The users registered email address.
 * @param {string} password The users registered password.
 * @returns {Promise<object>} A promise that resolves to the response data in JSON format.
 * @throws {Error} Throws an error if the login fails or the response is not okay.
 */

export async function login({ email, password }) {
  const apiUrl = API_AUTH_LOGIN;

  try {
    displayLoading();
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
  } finally {
    hideLoading();
  }
}

/**
 * Handles user login by collecting the email and password from the form,
 * then calls the 'login' function to authenticate the user via the API.
 * On successful login, the user's token and name are stored in localStorage,
 * and the user is redirected to the homepage. If unsuccessful, the function
 * 'displayError' is called to display an error message for the user.
 *
 * @param {Event} event The form submission event to prevent default behavior.
 * @returns {void} This function does not return any value.
 */

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
    displayError('Login failed: ' + error.message);
  }
}
