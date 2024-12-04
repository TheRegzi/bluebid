/**
 * Displays image(s) for the single auction listing page.
 * Creates an image carousel if there are multiple image URLs provided by the listing from the API, by creating a previous button and a next button.
 * Each button have their own click event listener, which calls the function 'moveSlide' to slide between the images when clicked.
 * If no images are available, a placeholder image is displayed.
 *
 * @param {Array<object>} listingArray - An array of image objects, each containing:
 * @param {string} listingArray[].url - The URL of the image.
 * @param {string} [listingArray[].alt] - The alt text for the image (optional).
 *
 * @returns {HTMLElement} The carousel element containing the images and navigation buttons.
 */

export function createCarousel(listingArray) {
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'relative overflow-hidden w-350 sm:w-550 mx-auto';

  const container = document.createElement('div');
  container.className = 'flex transition-transform duration-500 ease-in-out';
  carouselWrapper.appendChild(container);

  if (!listingArray || listingArray.length === 0) {
    const img = document.createElement('img');
    img.src =
      'https://img.freepik.com/free-vector/flat-design-no-photo-sign_23-2149272417.jpg?t=st=1732025243~exp=1732028843~hmac=90885c767238b4085c78b33d2e8a8113608c31d3256c30818a26717515635287&w=826';
    img.alt = 'No image available';
    img.classList.add(
      'w-350',
      'sm:w-550',
      'h-auto',
      'object-contain',
      'rounded-lg',
      'block',
      'mx-auto'
    );

    container.appendChild(img);

    return carouselWrapper;
  }

  listingArray.forEach((listing) => {
    const item = document.createElement('div');
    item.className = 'flex-none w-350 sm:w-550';
    item.innerHTML = `
      <div class="flex justify-center items-center w-full h-full">
        <img src="${listing.url}" 
             alt="${listing.alt || 'Image'}" 
             class="max-w-full max-h-full object-contain rounded-lg">
      </div>
    `;
    container.appendChild(item);
  });

  if (listingArray.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '❮';
    prevBtn.className =
      'absolute top-1/2 left-2 transform -translate-y-1/2 bg-accent text-white px-4 py-2 text-md rounded-full';
    prevBtn.addEventListener('click', () => {
      moveSlide(-1, container, listingArray.length);
    });
    carouselWrapper.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '❯';
    nextBtn.className =
      'absolute top-1/2 right-2 transform -translate-y-1/2 bg-accent text-white px-4 py-2 text-md rounded-full';
    nextBtn.addEventListener('click', () => {
      moveSlide(1, container, listingArray.length);
    });
    carouselWrapper.appendChild(nextBtn);
  }

  return carouselWrapper;
}

let slideIndex = 0;

function moveSlide(direction, container, totalSlides) {
  slideIndex += direction;

  if (slideIndex < 0) {
    slideIndex = totalSlides - 1;
  } else if (slideIndex >= totalSlides) {
    slideIndex = 0;
  }

  const offset = -(slideIndex * 100);
  container.style.transform = `translateX(${offset}%)`;
}
