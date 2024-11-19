import { API_AUCTION_LISTINGS } from '../constants.js';

const listingsContainer = document.getElementById('listings-container');
let currentPage = 1;
const listingsPerPage = 12;
let isFetching = false;
let isLastPage = false;

export async function fetchListings(limit = 12, page = 1) {
  const apiUrl = API_AUCTION_LISTINGS;

  try {
    const url = new URL(apiUrl);
    url.searchParams.append('_bids', 'true');
    url.searchParams.append('limit', limit);
    url.searchParams.append('page', page);

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
    console.log(data);

    if (meta.isLastPage) {
      isLastPage = true;
      console.log('Reached the last page of listings.');
    }

    if (Array.isArray(data) && data.length > 0) {
      renderListings(data);
      currentPage++;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isFetching = false;
  }
}

function renderListings(listings) {
  listings.forEach((listing) => {
    const listingElement = document.createElement('div');
    listingElement.classList.add('listing-item');
    const imageUrl =
      listing.media.length > 0
        ? listing.media[0].url
        : 'https://img.freepik.com/free-vector/flat-design-no-photo-sign_23-2149272417.jpg?t=st=1732025243~exp=1732028843~hmac=90885c767238b4085c78b33d2e8a8113608c31d3256c30818a26717515635287&w=826';
    const imageAlt =
      listing.media.length > 0
        ? listing.media[0].alt || listing.title
        : listing.title;

    listingElement.innerHTML = `
        <a href="/listing/index.html?id=${listing.id}" class="block">
          <div class="flex flex-col justify-center mx-auto w-80 h-96 mb-10">
            <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-4/5 object-cover rounded-t-xl shadow-2xl">
            <div class="bg-secondary rounded-b-xl p-5 shadow-lg border-t border-accent2 flex-grow">
              <h3 class="font-headingMd font-bold text-md text-shadow-lg">${listing.title}</h3>
              <p class="font-body">Current Bid: ${listing.bids?.length > 0 ? listing.bids[listing.bids.length - 1].amount : 0} credits</p>
            </div>
          </div>
        </a>
      `;
    listingsContainer.appendChild(listingElement);
  });
}

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
