import { API_AUCTION_LISTINGS } from '../constants.js';
import { deleteListing } from '../listings/delete.js';
import { addBidsContainerWhenToken } from '../bids/bids.js';
import { createCarousel } from './carousel.js';
import { displayLoading, hideLoading } from '../../UI/loading.js';
import { displayError } from '../../UI/error.js';

export async function fetchListing() {
  const listingId = new URLSearchParams(window.location.search).get('id');

  if (!listingId) {
    console.error('Listing ID not found in the URL');
    return;
  }

  const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}`;

  try {
    displayLoading();
    const url = new URL(apiUrl);
    url.searchParams.append('_bids', 'true');
    url.searchParams.append('_seller', 'true');

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
    return listing;
  } catch (error) {
    console.error(error);
    displayError(
      'An error occurred while loading the listing: ' + error.message
    );
  } finally {
    hideLoading();
  }
}

export async function displaySingleAuction() {
  const listing = await fetchListing();

  if (!listing) {
    console.error('Invalid listing data:', listing);
    return;
  }

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
  container.innerHTML = '';

  const carousel = createCarousel(listing.data.media || []);
  if (carousel) {
    container.appendChild(carousel);
  }

  const auctionDetails = document.createElement('div');
  auctionDetails.className = 'w-350 sm:w-550';
  auctionDetails.innerHTML = `
    <h1 class="font-headingMd font-medium text-lg text-shadow-lg mt-6">${listing.data.title}</h1>
    <p class='font-body text-sm font-medium mt-4'>Current bid: ${listing.data.bids?.length > 0 ? listing.data.bids[listing.data.bids.length - 1].amount : 0} Credits</p>
    <p class='font-body text-sm mt-4'>${listing.data.description}</p>
    <div class='flex justify-center my-10'>
      <p class='font-headingMd text-sm text-white bg-accent text-center px-3 py-7 rounded-xl w-96 shadow-xl'>${hasEnded ? 'This auction has ended.' : `This Auction Ends at: ${formattedEndsAt}`}</p>
    </div>
  `;
  container.appendChild(auctionDetails);

  const editListing = document.createElement('button');
  editListing.textContent = 'Edit Listing';
  editListing.classList.add(
    'bg-accent',
    'text-white',
    'font-accentFont',
    'text-sm',
    'p-2',
    'w-28',
    'shadow-xl',
    'cursor-pointer',
    'hover:bg-blue-500',
    'hover:scale-110',
    'transition',
    'mb-10'
  );

  const token = localStorage.getItem('userToken');
  const currentUser = localStorage.getItem('name');

  if (token && currentUser === listing.data.seller.name) {
    editListing.addEventListener('click', () => {
      window.location.href = `/listing/edit/index.html?id=${listing.data.id}`;
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Listing';
    deleteButton.classList.add(
      'bg-customRed',
      'py-2',
      'px-3',
      'font-accentFont',
      'ml-5',
      'text-white',
      'text-sm',
      'mb-10',
      'cursor-pointer',
      'hover:bg-red-500',
      'hover:scale-110',
      'transition'
    );

    deleteButton.onclick = function () {
      const confirmed = confirm('Are you sure you want to delete this post?');
      if (confirmed) {
        console.log('Deleting auction listing with ID:', listing.data.id);
        deleteListing(listing.data.id);
      }
    };

    container.appendChild(editListing);
    container.appendChild(deleteButton);
  }

  addBidsContainerWhenToken(listing);
}
