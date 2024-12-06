import { headers } from '../headers';
import { API_AUCTION_LISTINGS } from '../constants';
import { displayError } from '../../UI/error';
import { displayLoading, hideLoading } from '../../UI/loading';

/**
 * Tries to fetch an auction listing to use it in the 'populateInputs' function.
 * It sends a GET request to the API_AUCTION_LISTINGS/listingId endpoint.
 * It uses the `id` query parameter from the current page's URL to determine the listing ID.
 * If successful, it returns the data in JSON format.
 * If unsuccessful, it throws an error.
 *
 * @async
 * @returns {Promise<Object|null>} - A promise that resolves to the listing data in JSON format, or `null` if the fetch fails or the ID is not found.
 * @throws {Error} - Throws an error if the fetch fails.
 */

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

/**
 * Populates inputs to edit the auction listing, by using the data retrieved from the 'fetchListing' function.
 * If the listing cannot be fetched, it displays an error with the 'displayError' function.
 *
 * @async
 * @returns {Promise<void>} - Resolves when the form inputs are populated or an error is handled.
 */

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

/**
 * Updates a listing by sending a PUT request to the API_AUCTION_LISTINGS/listingId endpoint.
 * It gathers the data from the input fields, and sends it as the updated version of the listing.
 * If successful it returns the updated data in JSON format and redirects to the updated listing's page.
 * If unsuccessful, it displays an error with the 'displayError' function.
 *
 * @async
 * @param {string} listingId - The unique identifier of the listing to be deleted.
 * @param {Object} data - The data object containing updated listing details.
 * @param {string} data.title - The updated title of the listing.
 * @param {string} data.description - The updated description of the listing.
 * @param {Array<{url: string, alt: string}>} data.media - An array of media objects with URLs and alt texts for the listing.
 * @returns {Promise<Object|null>} - A promise that resolves to the listing data in JSON format, or `null` if the update fails or the ID is not found.
 * @throws {Error} - Throws an error if the update fails.
 */

export async function updateListing(listingId, { title, description, media }) {
  const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}`;

  try {
    displayLoading();
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
  } finally {
    hideLoading();
  }
}

/**
 * Initializes the submit button by adding a submit event listener.
 * The event listener prevents the default form submission behavior, validates the presence of a listing ID,
 * and takes the listingId and formData and passes it into the function 'updateListing' to update the listing.
 * If no listing ID is found, an error message is displayed using the `displayError` function.
 *
 * @returns {Promise<void>} - This function does not return a value; it attaches an event listener to the form.
 */

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
