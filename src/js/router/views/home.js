import { fetchListings } from '../../api/listings/multipleListings';

fetchListings();

function updateBannerBasedOnAuth() {
  const token = localStorage.getItem('userToken');
  const bannerBody = document.getElementById('banner-body');
  const bannerLink = document.getElementById('banner-link');

  if (token) {
    bannerBody.textContent =
      'Search Through Thousands of Items and Uncover Hidden Treasures.';
    bannerLink.innerHTML = `<a href='/search/index.html'>Search Here!</a>`;
  }
}

updateBannerBasedOnAuth();
