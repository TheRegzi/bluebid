import { fetchListings } from '../../api/listings/multipleListings';

fetchListings();

/**
 * Updates the home banner based on the user's authentication status.
 * If a 'userToken' exists in localStorage, it updates the banner text and link
 * to provide a more personalized experience.
 */

function updateBannerBasedOnAuth() {
  const token = localStorage.getItem('userToken');
  const bannerBody = document.getElementById('banner-body');
  const bannerLink = document.getElementById('banner-link');

  if (!bannerBody || !bannerLink) {
    console.error(
      'Banner elements not found: Ensure #banner-body and #banner-link exist in the DOM.'
    );
    return;
  }

  if (token) {
    bannerBody.textContent =
      'Search Through Thousands of Items and Uncover Hidden Treasures.';
    bannerLink.innerHTML = `<a href='/search/index.html'>Search Here!</a>`;
  }
}

updateBannerBasedOnAuth();
