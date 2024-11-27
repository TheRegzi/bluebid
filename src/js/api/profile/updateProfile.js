import { fetchUserProfile } from '../../api/profile/userProfile';
import { API_AUCTION_PROFILES } from '../constants';
import { headers } from '../headers';

export async function populateForms() {
  const profileData = await fetchUserProfile();
  console.log(profileData);

  if (!profileData) {
    alert('Failed to fetch the listing. Cannot populate form.');
    return;
  }

  document.getElementById('update-bio').value = profileData.bio || '';
  document.getElementById('update-image').value = profileData.avatar.url || '';
  document.getElementById('update-banner').value = profileData.banner.url || '';
}

export async function updateProfile(name, { bio, avatar, banner }) {
  const apiUrl = `${API_AUCTION_PROFILES}/${name}`;

  try {
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
    console.error('Failed to update the profile:', error);
    alert(`Could not update the profile: ${error.message}`);
    return;
  }
}

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
