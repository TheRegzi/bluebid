import { headers } from '../headers';
import { API_AUCTION_LISTINGS } from '../constants';

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
    alert('Failed to fetch the listing. Cannot populate form.');
    return;
  }

  document.getElementById('title').value = listing.data.title || '';
  document.getElementById('description').value = listing.data.description || '';
  document.getElementById('image1').value = listing.data.media?.[0]?.url || '';
  document.getElementById('image2').value = listing.data.media?.[1]?.url || '';
  document.getElementById('image3').value = listing.data.media?.[2]?.url || '';
  document.getElementById('deadline').value = listing.data.endsAt
    ? new Date(listing.data.endsAt).toISOString().split('T')[0]
    : '';
}

populateInputs();

export async function updateListing(
  id,
  { title, description, media, deadline }
) {
  const apiUrl = `${API_AUCTION_LISTINGS}/${id}`;

  try {
    const requestHeaders = await headers();
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: requestHeaders,

      body: JSON.stringify({
        title: title,
        description: description,
        media: media ? { url: media, alt: 'Auction Listing Image' } : null,
        endsAt: deadline,
      }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      console.log('Post updated successfully:', updatedPost);
      window.location.href = `/post/index.html?id=${id}`;
      return;
    } else {
      const errorMessage = await response.text();
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Failed to update the post:', error);
    alert(`Could not update the post: ${error.message}`);
    return;
  }
}
