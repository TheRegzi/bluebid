import { API_AUCTION_LISTINGS } from '../constants';
import { headers } from '../headers';
import { displayError } from '../../UI/error';

/**
 * Deletes a listing by sending a 'DELETE' request to the 'API_AUCTION_LISTINGS/listingId' endpoint.
 * If successful, it logs a success message and redirects to the home page.
 * If unsuccessful, it displays an error message with the 'displayError' function.
 *
 * @async
 * @param {string} listingId - The unique identifier of the listing to be deleted.
 * @returns {Promise<void>} - Resolves when the listing is deleted or an error is handled.
 * @throws {Error} - Throws an error if the deletion fails.
 */

export async function deleteListing(listingId) {
  const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}`;

  try {
    const requestHeaders = await headers();
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: requestHeaders,
    });

    if (response.status === 204) {
      console.log('Auction Listing deleted successfully.');
      window.location.href = `/index.html`;
      return;
    } else {
      throw new Error('Failed to delete listing.');
    }
  } catch (error) {
    console.error('Error:', error);
    displayError('Error deleting listing: ' + error.message);
  }
}
