import { API_AUCTION_LISTINGS } from '../constants.js';

export async function fetchListing() {
  const postId = new URLSearchParams(window.location.search).get('id');

  if (!postId) {
    console.error('Post ID not found in the URL');
    return;
  }

  const apiUrl = `${API_AUCTION_LISTINGS}/${postId}`;

  try {
    const url = new URL(apiUrl);
    url.searchParams.append('_bids', 'true');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const listing = await response.json();
    displaySingleAuction(listing);
  } catch (error) {
    console.error(error);
  }
}

function createCarousel(media) {
  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('relative', 'w-full');

  const imagesContainer = document.createElement('div');
  imagesContainer.id = 'carousel-images';
  imagesContainer.classList.add(
    'flex',
    'transition-transform',
    'duration-500',
    'ease-in-out'
  );
  carouselWrapper.appendChild(imagesContainer);

  if (!media || media.length === 0) {
    const img = document.createElement('img');
    img.src =
      'https://img.freepik.com/free-vector/flat-design-no-photo-sign_23-2149272417.jpg?t=st=1732025243~exp=1732028843~hmac=90885c767238b4085c78b33d2e8a8113608c31d3256c30818a26717515635287&w=826';
    img.alt = 'No image available';
    img.classList.add(
      'w-350',
      'sm:w-550',
      'h-full',
      'object-cover',
      'rounded-lg',
      'block'
    );
    imagesContainer.appendChild(img);
  } else {
    media.forEach((mediaItem, index) => {
      const img = document.createElement('img');
      img.src = mediaItem.url;
      img.alt = mediaItem.alt || 'No image available';
      img.classList.add(
        'w-350',
        'sm:w-550',
        'h-full',
        'object-cover',
        'rounded-lg',
        index === 0 ? 'block' : 'hidden'
      );
      imagesContainer.appendChild(img);
    });
  }

  const prevBtn = document.createElement('button');
  prevBtn.id = 'prev-btn';
  prevBtn.classList.add(
    'absolute',
    'top-1/2',
    'left-2',
    'transform',
    '-translate-y-1/2',
    'bg-gray-700',
    'text-white',
    'p-2',
    'rounded-full'
  );
  prevBtn.textContent = '❮';
  carouselWrapper.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.id = 'next-btn';
  nextBtn.classList.add(
    'absolute',
    'top-1/2',
    'right-2',
    'transform',
    '-translate-y-1/2',
    'bg-gray-700',
    'text-white',
    'p-2',
    'rounded-full'
  );
  nextBtn.textContent = '❯';
  carouselWrapper.appendChild(nextBtn);

  const indicatorsContainer = document.createElement('div');
  indicatorsContainer.id = 'carousel-indicators';
  indicatorsContainer.classList.add(
    'flex',
    'justify-center',
    'mt-4',
    'space-x-2'
  );
  media.forEach((_, index) => {
    const indicator = document.createElement('button');
    indicator.classList.add(
      'w-3',
      'h-3',
      'bg-gray-400',
      'rounded-full',
      index === 0 ? 'bg-gray-800' : 'bg-gray-400'
    );
    indicator.dataset.index = index;
    indicatorsContainer.appendChild(indicator);
  });
  carouselWrapper.appendChild(indicatorsContainer);

  let currentIndex = 0;

  function showImage(index) {
    const allImages = imagesContainer.querySelectorAll('img');
    const allIndicators = indicatorsContainer.querySelectorAll('button');

    allImages.forEach((img, i) => {
      img.classList.toggle('hidden', i !== index);
      img.classList.toggle('block', i === index);
    });

    allIndicators.forEach((btn, i) => {
      btn.classList.toggle('bg-gray-800', i === index);
      btn.classList.toggle('bg-gray-400', i !== index);
    });

    currentIndex = index;
  }

  nextBtn.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % media.length;
    showImage(nextIndex);
  });

  prevBtn.addEventListener('click', () => {
    const prevIndex = (currentIndex - 1 + media.length) % media.length;
    showImage(prevIndex);
  });

  indicatorsContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const index = parseInt(e.target.dataset.index, 10);
      showImage(index);
    }
  });

  return carouselWrapper;
}

async function displaySingleAuction(listing) {
  if (!listing) {
    console.error('Invalid listing data:', listing);
    return;
  }

  console.log(listing);

  const imageUrl =
    listing.data.media.length > 0
      ? listing.data.media[0].url
      : 'https://img.freepik.com/free-vector/flat-design-no-photo-sign_23-2149272417.jpg?t=st=1732025243~exp=1732028843~hmac=90885c767238b4085c78b33d2e8a8113608c31d3256c30818a26717515635287&w=826';
  const imageAlt =
    listing.data.media.length > 0
      ? listing.data.media[0].alt || listing.data.title
      : listing.data.title;

  const endsAtDate = new Date(listing.data.endsAt);
  const now = new Date();

  const hasEnded = endsAtDate < now;

  const formattedEndsAt = new Intl.DateTimeFormat('no-NO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(endsAtDate);

  const container = document.getElementById('listing-container');

  container.innerHTML = '';
  const carousel = createCarousel(listing.data.media || []);
  container.appendChild(carousel);

  container.innerHTML += `
      <div class='w-350 sm:w-550'>
      <h1 class="font-headingMd font-medium text-lg text-shadow-lg mt-4">${listing.data.title}</h1>
      <p class='font-body text-sm font-medium mt-4'>Current bid: ${listing.data.bids?.length > 0 ? listing.data.bids[listing.data.bids.length - 1].amount : 0} Credits</p>
      <p class='font-body text-sm mt-4'>${listing.data.description}</p>
      </div>
      <div class='flex justify-center'>
      <p class='font-headingMd text-sm text-white bg-accent text-center mt-8 px-3 py-5 rounded-lg w-72'>${hasEnded ? 'This auction has ended.' : `This Auction Ends at: ${formattedEndsAt}`}</p>
      </div>
  
      `;
}
