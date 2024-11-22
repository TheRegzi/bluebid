import { fetchListing, placeBid } from '../../api/listings/singleListing';

fetchListing();

function initializeBidCreation() {
  const form = document.getElementById('bid-form');
  if (!form) {
    console.error("Form with ID 'create-form' not found in postCreate.js.");
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(form);

      const isSuccess = await placeBid(formData);

      if (isSuccess) {
        console.log('Bid creation handled successfully');
        alert('Bid created successfully!');
      }
    } catch (error) {
      console.error('Unexpected error during bid creation:', error);
    }
  });
}

initializeBidCreation();

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
