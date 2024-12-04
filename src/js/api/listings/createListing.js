import { API_AUCTION_LISTINGS } from '../constants';
import { headers } from '../headers';
import { displayError } from '../../UI/error';
import { displayLoading, hideLoading } from '../../UI/loading';

/**
 * Creates an auction listing by sending a 'POST' request to the `API_AUCTION_LISTINGS` endpoint.
 * This function collects title, description, media (up to three images), and a deadline from the `formData` object.
 * It ensures that media URLs are formatted correctly and included only if provided.
 *
 * If the request is successful, it logs a success message and returns the newly created listing data.
 * If the request fails, it logs an error and throws the error for further handling.
 *
 * Dependencies:
 * - `displayLoading` and `hideLoading` are used for managing the loading state.
 * - `headers` is a helper function that provides the necessary request headers.
 *
 * @async
 * @param {FormData} formData - The form data containing the fields required to create a listing.
 * @param {string} formData.title - The title of the auction listing.
 * @param {string} formData.description - The description of the auction listing.
 * @param {string} [formData.image1] - The URL for the first image (optional).
 * @param {string} [formData.image2] - The URL for the second image (optional).
 * @param {string} [formData.image3] - The URL for the third image (optional).
 * @param {string} formData.deadline - The deadline for the auction in ISO 8601 format.
 *
 * @returns {Promise<object>} The newly created listing data from the API.
 * @throws {Error} Throws an error if the API request fails.
 */

export async function createListing(formData) {
  const apiUrl = API_AUCTION_LISTINGS;
  const title = formData.get('title');
  const description = formData.get('description');
  const image1 = formData.get('image1');
  const image2 = formData.get('image2');
  const image3 = formData.get('image3');
  const deadline = formData.get('deadline');

  const media = [];
  if (image1) media.push({ url: image1, alt: 'Auction Image 1' });
  if (image2) media.push({ url: image2, alt: 'Auction Image 2' });
  if (image3) media.push({ url: image3, alt: 'Auction Image 3' });

  try {
    displayLoading();
    const requestHeaders = await headers();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        title,
        description,
        ...(media.length > 0 && { media }),
        endsAt: deadline,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create listing: ${errorData.message || response.status}`
      );
    }

    const data = await response.json();
    console.log('Listing successfully created.');
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  } finally {
    hideLoading();
  }
}

/**
 * Handles the creation of the listing by calling the `createListing` function. If the listing is created successfully, it redirects the user to the index page (`/index.html`) and  * returns `true`.
 * If the creation fails, it displays an error message using `displayError` and returns `false`.
 *
 * @async
 * @param {FormData} formData - The form data containing the fields required to create a listing.
 * @returns {Promise<boolean>} Resolves to `true` if the listing is created successfully, or `false` if it fails.
 * @throws {Error} Re-throws the error from `createListing` if an unexpected failure occurs.
 */

export async function handleCreateListing(formData) {
  try {
    const result = await createListing(formData);
    console.log('Listing created successfully.');
    window.location.href = '/index.html';
    return true;
  } catch (error) {
    console.error('Failed to create listing:', error);
    displayError(
      'Failed to create listing. Make sure to set a valid deadline date.'
    );
    return false;
  }
}
