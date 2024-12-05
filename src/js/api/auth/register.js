import { API_AUTH_REGISTER } from '../constants';
import { displayError } from '../../UI/error';
import { displayLoading, hideLoading } from '../../UI/loading';

/**
 * Registers a new user by sending their details to the register API.
 * User gets registered by sending a POST request with their name, email and password.
 * The bio, avatar and banner fields are optional.
 * If the registration fails, it throws an error with a message from the API.
 *
 * @async
 * @param {string} name The username of the new user.
 * @param {string} email The email address of the new user.
 * @param {string} password The password for the new user.
 * @param {string} [bio] A brief bio for the user's profile.
 * @param {string} [avatar] The avatar image object, containing a `url` and an `alt` description.
 * @param {string} [avatar.url] - The URL of the user's avatar image.
 * @param {string} [avatar.alt] - The alternative text for the avatar image.
 * @param {string} [avatar] The banner image object, containing a `url` and an `alt` description.
 * @param {string} [banner.url] - The URL of the user's banner image.
 * @param {string} [banner.alt] - The alternative text for the banner image.
 * @returns {Promise<object>} A promise that resolves to the response data in JSON format.
 * @throws {Error} Throws an error if the registration fails or the response is not okay.
 */

export async function register({ name, email, password, bio, avatar, banner }) {
  const apiUrl = API_AUTH_REGISTER;

  try {
    displayLoading();
    const url = new URL(apiUrl);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        bio: bio || undefined,
        avatar: avatar?.url
          ? { url: avatar.url, alt: avatar.alt || '' }
          : undefined,
        banner: banner?.url
          ? { url: banner.url, alt: banner.alt || '' }
          : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Full error response:', errorData);

      let errorMessage = 'Unknown error';
      if (errorData.errors && errorData.errors.length > 0) {
        errorMessage = errorData.errors.map((e) => e.message).join(', ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }

      console.error('Extracted error message:', errorMessage);
      throw new Error(`Registration failed: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  } finally {
    hideLoading();
  }
}

/**
 * Handles user registration by collecting registration data from the form,
 * and calling the 'register' function. If the registration is successful,
 * the user is alerted and redirected to the login page. In case of failure,
 * the function 'displayError' is called to display an error message.
 *
 *
 * @param {Event} event The form submission event to prevent default behavior.
 * @returns {void} This function does not return any value.
 */

export async function onRegister(event) {
  event.preventDefault();

  const username = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const bio = document.getElementById('bio').value;
  const avatarUrl = document.getElementById('avatarUrl').value;
  const bannerUrl = document.getElementById('bannerUrl').value;

  const registrationData = {
    name: username,
    email: email,
    password: password,
    bio: bio || undefined,
    avatar: avatarUrl ? { url: avatarUrl, alt: 'Profile Avatar' } : undefined,
    banner: bannerUrl ? { url: bannerUrl, alt: 'Banner Image' } : undefined,
  };

  try {
    const response = await register(registrationData);
    window.location.href = '/auth/login/index.html';
  } catch (error) {
    console.error('Registration error:', error);
    displayError(error.message);
  }
}
