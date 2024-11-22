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

function createCarousel(listingArray) {
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'relative w-full carousel';

  const container = document.createElement('div');
  container.className = 'carousel-slides';
  carouselWrapper.appendChild(container);

  if (!listingArray || listingArray.length === 0) {
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

    container.appendChild(img);

    return carouselWrapper;
  }

  listingArray.forEach((listing, index) => {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.style.display = index === 0 ? 'block' : 'none';
    item.innerHTML = `
      <img src="${listing.url}" alt="${listing.alt || 'Image'}" class="w-350 sm:w-550 h-full object-cover shadow-xl">
    `;
    container.appendChild(item);
  });

  if (listingArray.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '❮';
    prevBtn.className =
      'absolute top-1/2 left-2 transform -translate-y-1/2 bg-accent text-white px-4 py-2 text-md rounded-full prev';
    prevBtn.addEventListener('click', () => {
      moveSlide(-1);
    });
    carouselWrapper.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '❯';
    nextBtn.className =
      'absolute top-1/2 right-2 transform -translate-y-1/2 bg-accent text-white px-4 py-2 text-md rounded-full next';
    nextBtn.addEventListener('click', () => {
      moveSlide(1);
    });
    carouselWrapper.appendChild(nextBtn);
  }

  showSlides(slideIndex);

  return carouselWrapper;
}

let slideIndex = 1;

function moveSlide(n) {
  showSlides((slideIndex += n));
}

function showSlides(n) {
  const slides = document.getElementsByClassName('carousel-item');

  if (slides.length === 0) {
    console.log('No slides to show.');
    return;
  }

  if (n > slides.length) {
    slideIndex = 1;
  } else if (n < 1) {
    slideIndex = slides.length;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }

  slides[slideIndex - 1].style.display = 'block';
}

async function displaySingleAuction(listing) {
  if (!listing) {
    console.error('Invalid listing data:', listing);
    return;
  }
  console.log(listing);
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
  if (carousel) {
    container.appendChild(carousel);
  }

  const auctionDetails = document.createElement('div');
  auctionDetails.className = 'w-350 sm:w-550';
  auctionDetails.innerHTML = `
    <h1 class="font-headingMd font-medium text-lg text-shadow-lg mt-4">${listing.data.title}</h1>
    <p class='font-body text-sm font-medium mt-4'>Current bid: ${listing.data.bids?.length > 0 ? listing.data.bids[listing.data.bids.length - 1].amount : 0} Credits</p>
    <p class='font-body text-sm mt-4'>${listing.data.description}</p>
    <div class='flex justify-center'>
      <p class='font-headingMd text-sm text-white bg-accent text-center mt-8 px-3 py-5 rounded-lg w-72 shadow-xl'>${hasEnded ? 'This auction has ended.' : `This Auction Ends at: ${formattedEndsAt}`}</p>
    </div>
  `;
  container.appendChild(auctionDetails);

  addBidsContainerWhenToken(listing);
}

async function addBidsContainerWhenToken(listing) {
  const bidsContainer = document.getElementById('bids-container');
  const token = localStorage.getItem('userToken');

  if (!bidsContainer) {
    console.error('Bids container element not found.');
    return;
  }

  if (!listing || !listing.data || !Array.isArray(listing.data.bids)) {
    console.error('Invalid listing or bids data:', listing);
    return;
  }

  if (token && listing.data.bids.length === 0) {
    const noBidsMessage = document.createElement('p');
    noBidsMessage.className = 'font-body text-sm text-black text-center mt-4';
    noBidsMessage.textContent = 'No placed bids yet.';
    bidsContainer.appendChild(noBidsMessage);
    return;
  }

  if (token && listing.data.bids.length > 0) {
    bidsContainer.innerHTML = `
      <h3 class="flex justify-center font-headingMd font-medium text-lg text-shadow-lg py-5">Placed Bids</h3>
    `;

    const sortedBids = listing.data.bids.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    sortedBids.forEach((bid, index) => {
      const createdDate = new Date(bid.created);
      if (isNaN(createdDate)) {
        console.error(`Invalid date for bid #${index + 1}:`, bid.created);
        return;
      }

      const formattedCreated = new Intl.DateTimeFormat('no-NO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(createdDate);

      const bidDiv = document.createElement('div');
      bidDiv.classList.add(
        'bg-secondary',
        'rounded-xl',
        'py-8',
        'my-4',
        'shadow-xl'
      );

      bidDiv.innerHTML = `
        <p class="font-body text-sm font-medium mx-8">${bid.bidder.name} bid ${bid.amount} Credits</p>
        <p class="font-body text-sm mx-8">Created: ${formattedCreated}</p>
      `;

      bidsContainer.appendChild(bidDiv);
    });
  }
}
