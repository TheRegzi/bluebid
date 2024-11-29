import { handleCreateListing } from '../../api/listings/createListing';

function initializeCreateListing() {
  const form = document.getElementById('create-form');

  if (!form) {
    console.error("Form with ID 'create-form' not found in createListing.js.");
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(form);

      const isSuccess = await handleCreateListing(formData);

      if (isSuccess) {
        console.log('Listing creation handled successfully');
      }
    } catch (error) {
      console.error('Unexpected error during creation:', error);
    }
  });
}

initializeCreateListing();
