import { headers } from '../headers';
import { API_AUCTION_PROFILES } from '../constants';
import { displayLoading, hideLoading } from '../../UI/loading';
import { truncateText } from '../../UI/truncateText';

/**
 * Fetches user profile by sending a GET request to the API_AUCTION_PROFILES/username endpoint.
 * The username is retrieved from `localStorage` under the key `name`.
 * If it's successful, it returns the profile data in JSON format.
 * If unsuccessful, it throws an error with a relevant message.
 *
 * @async
 * @returns {Promise<Object|null>} - A promise that resolves to the listing data in JSON format, or `null` if the update fails or the ID is not found.
 */

export async function fetchUserProfile() {
  const username = localStorage.getItem('name');
  const apiUrl = `${API_AUCTION_PROFILES}/${username}`;

  try {
    displayLoading();
    const url = new URL(apiUrl);
    url.searchParams.append('_listings', 'true');

    const requestHeaders = await headers();
    const response = await fetch(url, {
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
  } finally {
    hideLoading();
  }
}

/**
 * Displays the profile details of the logged-in user by creating and appending HTML elements
 * to dynamically generate the profile page. The data is fetched using the `fetchUserProfile` function.
 *
 * This function displays these profile details:
 * - **Banner Image**: Displayed at the top of the profile.
 * - **Avatar Image**: Displayed as the user's profile picture.
 * - **Credits**: Shows the user's total credits alongside a money bag icon.
 * - **Username**: Displayed as a heading.
 * - **Bio**: The user's biography or personal information.
 * - **Edit Button**: A button that redirects to the profile editing page.
 *
 * @async
 * @returns {Promise<void>} - Resolves when the profile details have been successfully rendered in the DOM.
 */

export async function displayLoggedInUserProfile() {
  const profileData = await fetchUserProfile();

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
    'sm:w-550',
    'sm:border-l-4',
    'sm:border-r-4',
    'sm:border-b-4',
    'border-secondary',
    'rounded-b-xl',
    'pb-10',
    'mb-5'
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
      'object-cover',
      'justify-center',
      'mx-auto',
      'absolute',
      'left-1/2',
      '-translate-x-1/2',
      '-translate-y-20',
      'shadow-lg'
    );

    profileElement.appendChild(image);
  }


  const credits = document.createElement('div');
  credits.textContent = `${profileData.credits} Credits`;
  credits.classList.add(
    'border-4',
    'border-secondary',
    'mt-24',
    'relative',
    'w-52',
    'mx-auto',
    'font-accentFont',
    'font-medium',
    'rounded-lg',
    'px-6',
    'py-2',
    'flex',
    'gap-1',
    'justify-center',
    'text-md',
    'shadow-xl'
  );

  const username = document.createElement('h1');
  username.textContent = profileData.name;
  username.classList.add(
    'text-lg',
    'font-headingMd',
    'font-medium',
    'mt-8',
    'text-black',
    'text-shadow-lg'
  );

  const content = document.createElement('p');
  content.textContent = profileData.bio;
  content.classList.add('text-sm', 'font-body', 'm-4');

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
    'mt-4',
    'transition',
    'hover:bg-blue-500',
    'hover:scale-110'
  );

  editButton.addEventListener('click', () => {
    window.location.href = '/profile/edit/index.html';
  });

  profileElement.appendChild(credits);
  profileElement.appendChild(username);
  profileElement.appendChild(content);
  profileElement.appendChild(editButton);

  container.appendChild(profileElement);
}

/**
 * It takes the profile data retrieved from the 'fetchUserProfile' function to display all the auction
 * listings that the logged in user has created. For each listing, it displays the title, description and the first
 * image of the listing. The title and description has the 'truncateText' function added to them, to shorten the
 * characters. If there is no profile data, it displays an error message. If there are no listings created, it says that
 * no listings are made yet.
 * When clicking on one of the listings, it takes the user to the corresponding listing.
 * It sorts the listings, so that the newest listing is always at the top.
 *
 * @async
 * @returns {Promise<void>} - Resolves when the listings have been successfully rendered in the DOM.
 */

export async function addUsersAuctionListings() {
  const profileData = await fetchUserProfile();

  const auctionContainer = document.getElementById('auction-listings');

  if (!auctionContainer) {
    console.error('Error: auctionContainer not found in the DOM.');
    return;
  }

  auctionContainer.innerHTML = '';
  auctionContainer.classList.add(
    'flex',
    'flex-col',
    'justify-center',
    'items-center',
    'w-full',
    'mb-5'
  );

  const auctionElement = document.createElement('div');
  auctionElement.classList.add(
    'flex',
    'flex-col',
    'mx-auto',
    'justify-center',
    'text-center',
    'align-center',
    'w-full',
    'sm:w-550',
    'mt-5'
  );

  if (!profileData || !Array.isArray(profileData.listings)) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'No auction listings available to display.';
    errorMessage.classList.add('text-gray-500', 'text-center', 'mt-5');
    auctionContainer.appendChild(errorMessage);
    return;
  }

  if (profileData.listings.length === 0) {
    const noListings = document.createElement('p');
    noListings.textContent = 'No auction listings created yet.';
    noListings.classList.add('font-body', 'font-medium', 'text-sm', 'mb-2');

    auctionElement.appendChild(noListings);
  }

  if (profileData.listings.length > 0) {
    profileData.listings.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    profileData.listings.forEach((listing) => {
      const listingElement = document.createElement('div');
      listingElement.classList.add(
        'flex',
        'flex-col',
        'my-4',
        'bg-secondary',
        'rounded-lg',
        'p-4',
        'shadow-xl',
        'w-350',
        'mx-auto',
        'justify-center',
        'cursor-pointer',
        'hover:scale-110',
        'transition'
      );

      listingElement.innerHTML = `
        <a href='/listing/index.html?id=${listing.id}'>
        <div class='flex flex-row'>
            <div class='flex flex-col w-56 justify-center mx-auto'>
                <h3 class='font-headingMd font-medium text-md text-shadow text-left'>${truncateText(listing.title, 25)}</h3>
                <p class='font-body text-sm text-left'>${truncateText(listing.description, 30)}</p>
            </div>
            <div class='flex items-center'>
                <img src="${listing?.media[0]?.url || 'https://img.freepik.com/free-vector/flat-design-no-photo-sign_23-2149272417.jpg?t=st=1732025243~exp=1732028843~hmac=90885c767238b4085c78b33d2e8a8113608c31d3256c30818a26717515635287&w=826'}" alt="Auction Image" class='w-20 h-16 object-cover rounded-lg'>
            </div>
        </div>
        </a>
      `;
      auctionElement.appendChild(listingElement);
    });
  }

  auctionContainer.appendChild(auctionElement);
}
