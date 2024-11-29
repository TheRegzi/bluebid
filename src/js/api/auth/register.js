import { API_AUTH_REGISTER } from '../constants';
import { displayError } from '../../UI/error';

export async function register({ name, email, password, bio, avatar, banner }) {
  const apiUrl = API_AUTH_REGISTER;

  try {
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
          ? { url: banner.url, alt: avatar.alt || '' }
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
  }
}

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
