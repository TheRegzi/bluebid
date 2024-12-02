import { API_AUCTION_LISTINGS } from '../constants';
import { headers } from '../headers';
import { displayError } from '../../UI/error';

export async function deleteListing(listingId) {
  const apiUrl = `${API_AUCTION_LISTINGS}/${listingId}`;

  try {
    const requestHeaders = await headers();
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: requestHeaders,
    });

    if (response.status === 204) {
      displayError('Auction Listing deleted successfully.');
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
