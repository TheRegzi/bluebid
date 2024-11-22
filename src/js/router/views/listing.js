import { fetchListing } from '../../api/listings/singleListing';

fetchListing();

function updateBidContainerBasedOnAuth() {
  const bidHeading = document.getElementById('bid-heading');
  const bidBody = document.getElementById('bid-body');
  const bidForm = document.getElementById('bid-form');
  const loginLink = document.getElementById('login-link');
  const token = localStorage.getItem('userToken');

  if (!token) {
    bidHeading.textContent = 'Ready to bid?';
    bidBody.textContent =
      'Log in now to make your offer. Place your bid and join the auction to compete for this item!';
    bidForm.classList.add('hidden');
  } else {
    loginLink.classList.add('hidden');
  }
}

updateBidContainerBasedOnAuth();
