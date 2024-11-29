export function createCarousel(listingArray) {
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
