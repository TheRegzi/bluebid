import { API_AUCTION_LISTINGS } from '../constants.js';
import { displayLoading, hideLoading } from '../../UI/loading.js';
import { displayError } from '../../UI/error.js';
import { truncateText } from '../../UI/truncateText.js';

const listingsContainer = document.getElementById('listings-container');
let currentPage = 1;
const listingsPerPage = 12;
let isFetching = false;
let isLastPage = false;

/**
 * Fetches multiple auction listings by sending a 'GET' request to the 'API_AUCTION_LISTINGS' endpoint.
 * This function fetches listings from the API with pagination and sorting applied.
 * Takes the limit and page parameters to limit the amount of listings per page and which page to retrieve.
 * If successful, it calls the function 'renderListings' to display the listings on the page.
 * If it fails, it calls the 'displayError' function to display an error message.
 *
 * @async
 * @param {number} [limit=12] - The number of listings to fetch per page (default is 12).
 * @param {number} [page=1] - The page number to retrieve (default is 1).
 * @returns {Promise<void>} Resolves when the listings are successfully fetched and rendered.
 * @throws {Error} Throws an error if the API request fails or the response is invalid.
 */

export async function fetchListings(limit = 12, page = 1) {
  const apiUrl = API_AUCTION_LISTINGS;

  try {
    displayLoading();
    const url = new URL(apiUrl);
    url.searchParams.append('_bids', 'true');
    url.searchParams.append('limit', limit);
    url.searchParams.append('page', page);
    url.searchParams.append('sort', 'created');
    url.searchParams.append('sortOrder', 'desc');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data, meta } = await response.json();

    if (meta.isLastPage) {
      isLastPage = true;
      console.log('Reached the last page of listings.');
    }

    if (Array.isArray(data) && data.length > 0) {
      renderListings(data);
      currentPage++;
    }
  } catch (error) {
    console.error('Failed to fetch listings:', error.message);
    displayError('Unable to fetch auction listings. Please try again later.');
  } finally {
    isFetching = false;
    hideLoading();
  }
}

/**
 * Displays multiple auction listings on the page.
 * This function takes an array of `listing` objects and dynamically creates HTML elements
 * for each listing. It includes `media`, `title` and `current bid` for each listing. For the title, the function 'truncateText' is called to shorten it to max. 30 characters. For   * each listing, it creates a clickable link that wraps the listing,
 * directing the user to the corresponding single auction listing page when clicked. The function then appends the listings to the 'listingsContainer'.
 *
 * @param {Array<object>} listings - An array of listing objects, each containing:
 * @param {Array<object>} [listings[].media] - An array of media objects for the listing (optional).
 * @param {string} [listings[].media[].url] - The URL of the media associated with the listing.
 * @param {string} [listings[].media[].alt] - The alt text for the media (optional).
 * @param {string} listings[].title - The title of the listing.
 * @param {Array<object>} [listings[].bids] - An array of bid objects for the listing (optional).
 * @param {number} [listings[].bids[].amount] - The amount of the latest bid (optional).
 * @param {string} listings[].id - The unique ID of the listing, used for linking to the details page.
 */

function renderListings(listings) {
  listings.forEach((listing) => {
    const listingElement = document.createElement('div');
    const imageUrl =
      listing.media.length > 0
        ? listing.media[0].url
        : 'https://img.freepik.com/free-vector/flat-design-no-photo-sign_23-2149272417.jpg?t=st=1732025243~exp=1732028843~hmac=90885c767238b4085c78b33d2e8a8113608c31d3256c30818a26717515635287&w=826';
    const imageAlt =
      listing.media.length > 0
        ? listing.media[0].alt || listing.title
        : listing.title;

    listingElement.innerHTML = `
        <a href="/listing/index.html?id=${listing.id}" class="block group">
          <div class="mx-auto w-80 sm:w-96 h-96 mb-10 transition-all group-hover:shadow-2xl brightness-95 group-hover:brightness-100 md:group-hover:scale-105 rounded-xl">
            <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-4/5 object-cover rounded-t-xl shadow-2xl">
            <div class="bg-secondary rounded-b-xl p-5 shadow-lg border-t border-accent2 flex-grow">
              <h3 class="font-headingMd font-bold text-md text-shadow-lg">${truncateText(listing.title, 30)}</h3>
              <p class="font-body">Current Bid: ${listing.bids?.length > 0 ? listing.bids[listing.bids.length - 1].amount : 0} credits</p>
            </div>
          </div>
        </a>
      `;
    listingsContainer.appendChild(listingElement);
  });
}

/**
 * Handles infinite scrolling by loading more posts when the user scrolls to the bottom of the page. When scrolling to the bottom of page, it calls 'fetchListings' to fetch more      * posts to show.
 * This function listens for the scroll event and checks if the user has reached near the bottom.
 * If the conditions are met, it sets `isFetching` to `true` and calls `fetchListings`
 * to fetch additional listings for the next page.
 *
 * Dependencies:
 * - `fetchListings` must be defined and handle pagination.
 * - `isFetching` and `isLastPage` must be globally accessible to control the fetch state.
 *
 * @listens scroll
 */

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (
    scrollTop + clientHeight >= scrollHeight - 50 &&
    !isFetching &&
    !isLastPage
  ) {
    isFetching = true;
    fetchListings(listingsPerPage, currentPage);
  }
}

window.addEventListener('scroll', handleScroll);
