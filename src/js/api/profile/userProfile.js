import { headers } from '../headers';
import { API_AUCTION_PROFILES } from '../constants';

export async function fetchUserProfile() {
  const username = localStorage.getItem('name');
  const apiUrl = `${API_AUCTION_PROFILES}/${username}`;

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
  container.classList.add('flex', 'justify-center', 'items-center', 'w-full');

  const profileElement = document.createElement('div');
  profileElement.classList.add(
    'flex',
    'flex-col',
    'mx-auto',
    'justify-center',
    'text-center',
    'align-center',
    'w-full',
    'sm:w-550'
  );

  if (profileData.banner && profileData.banner.url) {
    const bannerImage = document.createElement('img');
    bannerImage.src = profileData.banner.url;
    bannerImage.alt = profileData.banner.alt || 'Profile Banner';
    bannerImage.classList.add(
      'w-full',
      'sm:w-550',
      'h-56',
      'object-cover',
      'mt-0'
    );

    profileElement.appendChild(bannerImage);
  }

  if (profileData.avatar && profileData.avatar.url) {
    const image = document.createElement('img');
    image.src = profileData.avatar.url;
    image.alt = profileData.avatar.alt || 'Profile Avatar';
    image.classList.add(
      'rounded-full',
      'w-36',
      'h-36',
      'justify-center',
      'mx-auto',
      'absolute',
      'left-1/2',
      '-translate-x-1/2'
    );

    profileElement.appendChild(image);
  }

  const credits = document.createElement('div');

  const username = document.createElement('h2');
  username.textContent = profileData.name;
  username.classList.add(
    'text-lg',
    'font-headingMd',
    'font-medium',
    'mt-28',
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
    'font-accentFont',
    'w-32',
    'mx-auto',
    'mt-4'
  );

  profileElement.appendChild(username);
  profileElement.appendChild(content);
  profileElement.appendChild(editButton);

  container.appendChild(profileElement);
}
