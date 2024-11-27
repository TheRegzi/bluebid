import { headers } from '../headers';
import { API_SOCIAL_PROFILES } from '../constants';

export async function fetchUserProfile() {
  const username = localStorage.getItem('name');
  const apiUrl = `${API_SOCIAL_PROFILES}/${username}`;

  try {
    const requestHeaders = await headers();
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: requestHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch profile: ${errorData.message || response.status}`
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting profile details:', error);
    throw error;
  }
}

export async function displayLoggedInUserProfile(data) {
  const profileData = await fetchUserProfile();
  console.log(profileData);

  const container = document.getElementById('profile-container');
  container.innerHTML = '';

  const profileElement = document.createElement('div');
  profileElement.classList.add('profile');

  if (profileData.banner && profileData.banner.url) {
    const bannerImage = document.createElement('img');
    bannerImage.src = profileData.banner.url;
    bannerImage.alt = profileData.banner.alt || 'Profile Banner';
    bannerImage.classList.add(
      'w-350',
      'sm:w-550',
      'h-44',
      'object-cover',
      'mt-0'
    );

    profileElement.appendChild(bannerImage);
  }

  if (profileData.avatar && profileData.avatar.url) {
    const image = document.createElement('img');
    image.src = profileData.avatar.url;
    image.alt = profileData.avatar.alt || 'Profile Avatar';
    image.classList.add('rounded-full', 'w-44', 'h-44');

    profileElement.appendChild(image);
  }

  const username = document.createElement('h2');
  username.textContent = profileData.name;
  username.classList.add(
    'text-lg',
    'font-headingMd',
    'font-medium',
    'my-3',
    'text-black'
  );

  const content = document.createElement('p');
  content.textContent = profileData.bio;
  content.classList.add('text-sm', 'font-body', 'mb-3');

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit Profile';
  editButton.classList.add(
    'bg-accent',
    'text-white',
    'px-4',
    'py-2',
    'font-accentFont'
  );

  profileElement.appendChild(username);
  profileElement.appendChild(content);
  profileElement.appendChild(editButton);

  container.appendChild(profileElement);
}
