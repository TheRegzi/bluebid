import { API_AUCTION_LISTINGS } from '../constants.js';

const listingsContainer = document.getElementById('listings-container');
let currentPage = 1;
const listingsPerPage = 10;
let isFetching = false;
let isLastPage = false;

export async function fetchListings(limit = 10, page = 1) {
  const apiUrl = API_AUCTION_LISTINGS;

  try {
    const url = new URL(apiUrl);
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
    <div class='flex flex-col justify-center mx-auto w-350 mb-10'>
    <img src="${imageUrl}" alt="${imageAlt}" class='w-350 rounded-t-xl shadow-2xl'>
        <div class='bg-secondary rounded-b-xl mb-2 p-3 shadow-lg'>
            <h3 class='font-headingMd font-bold text-md'>${listing.title}</h3>
            <p class='font-body'>Current Bid: ${listing.currentBid || 0} credits</p>
        <div>
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
