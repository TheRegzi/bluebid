import { API_AUCTION_LISTINGS } from '../constants';
import { headers } from '../headers';
import { displayError } from '../../UI/error';
import { fetchListing } from '../listings/singleListing';

export async function addBidsContainerWhenToken(listing) {
  const bidsContainer = document.getElementById('bids-container');
  const token = localStorage.getItem('userToken');

  if (!bidsContainer) {
    console.error('Bids container element not found.');
    return;
  }

  if (!listing || !listing.data || !Array.isArray(listing.data.bids)) {
    console.error('Invalid listing or bids data:', listing);
    return;
  }

  if (token && listing.data.bids.length === 0) {
    const noBidsMessage = document.createElement('p');
    noBidsMessage.className =
      'font-body font-medium text-sm text-black text-center mt-4';
    noBidsMessage.textContent = 'No placed bids.';
    bidsContainer.appendChild(noBidsMessage);
    return;
  }

  if (token && listing.data.bids.length > 0) {
    bidsContainer.innerHTML = `
        <h3 class="flex justify-center font-headingMd font-medium text-lg text-shadow-lg py-5">Placed Bids</h3>
      `;

    const sortedBids = listing.data.bids.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    sortedBids.forEach((bid, index) => {
      const createdDate = new Date(bid.created);
      if (isNaN(createdDate)) {
        console.error(`Invalid date for bid #${index + 1}:`, bid.created);
        return;
      }

      const formattedCreated = new Intl.DateTimeFormat('no-NO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(createdDate);

      const bidDiv = document.createElement('div');
      bidDiv.classList.add(
        'bg-secondary',
        'rounded-xl',
        'py-8',
        'my-4',
        'shadow-xl'
      );

      bidDiv.innerHTML = `
          <p class="font-body text-sm font-medium mx-8">${bid.bidder.name} bid ${bid.amount} Credits</p>
          <p class="font-body text-sm mx-8">Created: ${formattedCreated}</p>
        `;

      bidsContainer.appendChild(bidDiv);
    });
  }
}

export async function placeBid(formData) {
  const listingId = new URLSearchParams(window.location.search).get('id');

  if (!listingId) {
    displayError('Invalid listing ID. Cannot place bid.');
    return;
  }

  const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}/bids`;
  const bidInput = formData.get('bid-input');

  try {
    const requestHeaders = await headers();
    const payload = {
      amount: parseFloat(bidInput),
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Bid placed successfully:', result);
      return result;
    } else {
      const errorDetails = await response.json();
      console.error(
        'Failed to place bid:',
        JSON.stringify(errorDetails, null, 2)
      );
      displayError(
        `Error placing bid: ${errorDetails.errors?.[0]?.message || errorDetails.message || 'Unknown error'}`
      );
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    displayError('Error placing bid: ' + error.message);
  }
}

export function initializeBidCreation() {
  const form = document.getElementById('bid-form');
  if (!form) {
    console.error("Form with ID 'create-form' not found in postCreate.js.");
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(form);

      const isSuccess = await placeBid(formData);

      if (isSuccess) {
        console.log('Bid creation handled successfully.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Unexpected error during bid creation:', error);
    }
  });
}

export async function updateBidContainerBasedOnAuthAndDeadline() {
  const bidHeading = document.getElementById('bid-heading');
  const bidBody = document.getElementById('bid-body');
  const bidForm = document.getElementById('bid-form');
  const loginLink = document.getElementById('login-link');
  const token = localStorage.getItem('userToken');
  const listing = await fetchListing();
  const deadline = new Date(listing.data.endsAt);
  const currentDate = new Date();
  const biddingContainer = document.getElementById('bidding-container');

  if (currentDate > deadline) {
    biddingContainer.classList.add('hidden');
    return;
  }

  if (!token) {
    bidHeading.textContent = 'Ready to bid?';
    bidBody.textContent =
      'Log in now to make your offer. Place your bid and join the auction to compete for this item!';
    bidForm.classList.add('hidden');
  } else {
    loginLink.classList.add('hidden');
  }
}
