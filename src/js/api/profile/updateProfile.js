import { fetchUserProfile } from '../../api/profile/userProfile';
import { API_AUCTION_PROFILES } from '../constants';
import { headers } from '../headers';
import { displayError } from '../../UI/error';
import { displayLoading, hideLoading } from '../../UI/loading';

/**
 * Populates form inputs by using the data retrieved from the 'fetchUserProfile' function.
 * If no profile data, it displays an error message with the 'displayError' function.
 *
 * Form fields populated:
 * - Bio input (`#update-bio`) with the user's bio.
 * - Avatar URL input (`#update-image`) with the user's avatar URL.
 * - Banner URL input (`#update-banner`) with the user's banner URL.
 *
 * @async
 * @returns {Promise<void>} - Resolves when the form inputs are populated or an error is handled.
 */

export async function populateForms() {
  const profileData = await fetchUserProfile();

  if (!profileData) {
    displayError('Failed to fetch the listing. Cannot populate form.');
    return;
  }

  document.getElementById('update-bio').value = profileData.bio || '';
  document.getElementById('update-image').value = profileData.avatar.url || '';
  document.getElementById('update-banner').value = profileData.banner.url || '';
}

/**
 * Updates user profile by sending a PUT request to the API_AUCTION_PROFILES/name endpoint.
 * The function takes the username and collects the updated data (bio, avatar, and banner) from input fields and sends it as the updated profile information.
 * If successful, it sends the data from the inputs as the updated version of the profile and redirects to the home page.
 * If unsuccessful, it displays an error with the 'displayError' function.
 *
 * @param {string} name - The registered username of the logged in user.
 * @param {Object} data - The data object containing updated profile details.
 * @param {string} [data.bio] - The updated bio for the user profile.
 * @param {Object} [data.avatar] - The updated avatar object containing its URL and optional alt text.
 * @param {string} data.avatar.url - The URL of the avatar image.
 * @param {string} [data.avatar.alt] - The alternative text for the avatar image.
 * @param {Object} [data.banner] - The updated banner object containing its URL and optional alt text.
 * @param {string} data.banner.url - The URL of the banner image.
 * @param {string} [data.banner.alt] - The alternative text for the banner image.
 * @returns {Promise<Object|null>} - A promise that resolves to the profile data in JSON format, or `null` if the update fails.
 * @throws {Error} - Throws an error if the update fails.
 */

export async function updateProfile(name, { bio, avatar, banner }) {
  const apiUrl = `${API_AUCTION_PROFILES}/${name}`;

  try {
    displayLoading();
    const requestHeaders = await headers();
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: requestHeaders,

      body: JSON.stringify({
        bio: bio || '',
        avatar: avatar ? { url: avatar.url, alt: avatar.alt || '' } : undefined,
        banner: banner ? { url: banner.url, alt: banner.alt || '' } : undefined,
      }),
    });

    if (response.ok) {
      const updatedListing = await response.json();
      console.log('Profile updated successfully:', updatedListing);
      window.location.href = `/profile/index.html`;
      return;
    } else {
      const errorMessage = await response.text();
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Failed to update the profile:', error.message);
    displayError(
      'Failed to update the profile. Please make sure you have provided valid URLs for Profile and Banner Image.'
    );
    return;
  } finally {
    hideLoading();
  }
}

/**
 * Initializes the submit button by adding a submit event listener. Prevents default form behavior.
 * It collects the new formData and calls the `updateProfile` function with the logged-in user's username and the updated profile data.
 * The username is retrieved from `localStorage` under the key `name`.
 *
 * @returns {void} - This function does not return a value; it sets up an event listener for the form submission.
 */

export function initializeSubmitButton() {
  document
    .querySelector('form[name="update-profile"]')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = {
        bio: document.getElementById('update-bio').value.trim(),
        avatar: {
          url: document.getElementById('update-image').value.trim(),
          alt: 'Profile Image',
        },
        banner: {
          url: document.getElementById('update-banner').value.trim(),
          alt: 'Banner Image',
        },
      };

      const name = localStorage.getItem('name');

      await updateProfile(name, formData);
    });
}
