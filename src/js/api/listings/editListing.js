import { headers } from '../headers';
import { API_AUCTION_LISTINGS } from '../constants';
import { displayError } from '../../UI/error';

async function fetchListing() {
  const listingId = new URLSearchParams(window.location.search).get('id');

  if (!listingId) {
    console.error('Post ID not found in the URL');
    return null;
  }

  const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

async function populateInputs() {
  const listing = await fetchListing();

  if (!listing) {
    displayError('Failed to fetch the listing. Cannot populate form.');
    return;
  }

  document.getElementById('title').value = listing.data.title || '';
  document.getElementById('description').value = listing.data.description || '';
  document.getElementById('image1').value = listing.data.media?.[0]?.url || '';
  document.getElementById('image2').value = listing.data.media?.[1]?.url || '';
  document.getElementById('image3').value = listing.data.media?.[2]?.url || '';
}

populateInputs();

export async function updateListing(listingId, { title, description, media }) {
  const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}`;

  try {
    const requestHeaders = await headers();
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: requestHeaders,

      body: JSON.stringify({
        title: title || '',
        description: description || '',
        media:
          Array.isArray(media) && media.length > 0
            ? media.map((url, index) => ({
                url: url,
                alt: `Auction Listing Image ${index + 1}`,
              }))
            : null,
      }),
    });

    if (response.ok) {
      const updatedListing = await response.json();
      console.log('Listing updated successfully:', updatedListing);
      window.location.href = `/listing/index.html?id=${listingId}`;
      return;
    } else {
      const errorMessage = await response.text();
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Failed to update the listing:', error);
    displayError(`Could not update the listing: ${error.message}`);
    return;
  }
}

export function initializeSubmitButton() {
  document
    .querySelector('form[name="create-form"]')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      const listingId = new URLSearchParams(window.location.search).get('id');
      if (!listingId) {
        displayError('No listing ID found in the URL.');
        return;
      }

      const formData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        media: [
          document.getElementById('image1').value.trim(),
          document.getElementById('image2').value.trim(),
          document.getElementById('image3').value.trim(),
        ].filter(Boolean),
      };
      await updateListing(listingId, formData);
    });
}
