import { API_AUCTION_LISTINGS } from '../constants.js';

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
      : 'https://img.freepik.com/free-vector/flat-design-no-photo-sign_23-2149272417.jpg?t=st=1732025243~exp=1732028843~hmac=90885c767238b4085c78b33d2e8a8113608c31d3256c30818a26717515635287&w=826';
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
      <p>Current bid: ${listing.data.bids?.length > 0 ? listing.data.bids[listing.data.bids.length - 1].amount : 0} Credits</p>
      <p>${listing.data.description}</p>
      </div>
      </div>
      <div>
      <p>${hasEnded ? 'This auction has ended.' : `This Auction Ends at: ${formattedEndsAt}`}</p>
      </div>
  
      `;
}
