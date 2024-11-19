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
        : 'https://via.placeholder.com/150';
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

export async function fetchListing() {
  const postId = new URLSearchParams(window.location.search).get('id');

  if (!postId) {
    console.error('Post ID not found in the URL');
    return;
  }

  const apiUrl = `${API_AUCTION_LISTINGS}/${postId}`;

  try {
    const url = new URL(apiUrl);
    url.searchParams.append('_bids', 'true');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const listing = await response.json();
    displaySingleAuction(listing);
  } catch (error) {
    console.error(error);
  }
}

async function displaySingleAuction(listing) {
  if (!listing) {
    console.error('Invalid listing data:', listing);
    return;
  }

  console.log(listing);

  const imageUrl =
    listing.data.media.length > 0
      ? listing.data.media[0].url
      : 'https://via.placeholder.com/150';
  const imageAlt =
    listing.data.media.length > 0
      ? listing.data.media[0].alt || listing.data.title
      : listing.data.title;

  const endsAtDate = new Date(listing.data.endsAt);
  const now = new Date();

  const hasEnded = endsAtDate < now;

  const formattedEndsAt = new Intl.DateTimeFormat('no-NO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(endsAtDate);

  const container = document.getElementById('listing-container');
  container.innerHTML = `
    <div>
    <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-4/5 object-cover rounded-t-xl shadow-2xl">
    <div>
    <h1>${listing.data.title}</h1>
    <p>Current bid: ${listing.data.bids?.length > 0 ? listing.data.bids[listing.data.bids.length - 1].amount : 0}
    <p>${listing.data.description}</p>
    </div>
    </div>
    <div>
    <p>${hasEnded ? 'This auction has ended.' : `This Auction Ends at: kl. ${formattedEndsAt}`}</p>
    </div>

    `;
}
