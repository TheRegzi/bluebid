import { API_AUCTION_LISTINGS } from '../constants';
import { headers } from '../headers';
import { displayError } from '../../UI/error';
import { displayLoading, hideLoading } from '../../UI/loading';

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
