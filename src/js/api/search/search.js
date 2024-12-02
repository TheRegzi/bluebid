import { API_AUCTION_LISTINGS } from '../constants';
import { displayLoading, hideLoading } from '../../UI/loading';

export async function search(query) {
  const apiUrl = `${API_AUCTION_LISTINGS}/search?q=${encodeURIComponent(query)}`;

  try {
    displayLoading();
    const url = new URL(apiUrl);
    url.searchParams.append('_bids', 'true');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.errors?.[0]?.message || errorData.message || 'Search failed';

      throw new Error(errorMessage);
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Search error:', error.message);
    throw error;
  } finally {
    hideLoading();
  }
}

export async function renderSearchResults(container, results, query) {
  container.innerHTML = '';
  container.classList.add('mt-3');

  const heading = document.createElement('h2');
  heading.className = 'search-results-heading font-headingMd text-md mt-4 mb-2';
  heading.textContent = `Search results for "${query}":`;
  container.appendChild(heading);

  if (results.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.className = 'no-results-message font-body text-sm';
    noResultsMessage.textContent = 'No listings found.';
    container.appendChild(noResultsMessage);
    return;
  }

  results.forEach((result) => {
    const resultElement = document.createElement('div');
    resultElement.className = 'result-item';
    resultElement.classList.add(
      'my-4',
      'bg-secondary',
      'rounded-lg',
      'p-5',
      'shadow-xl',
      'flex'
    );
    console.log(result);

    resultElement.innerHTML = `
    <a href='/listing/index.html?id=${result.id}'>
    <div class='flex flex-row'>
    <div class='flex-col w-56 sm:w-96 pt-3 sm:pt-5'>
        <h3 class='font-headingMd font-medium text-md text-shadow'>${result.title}</h3>
        <p class='font-body text-sm'>Current Bid: ${result.bids?.length > 0 ? result.bids[result.bids.length - 1].amount : 0} Credits</p>
        </div>
        <div class=''>
        <img src="${result?.media[0]?.url || 'https://img.freepik.com/free-vector/flat-design-no-photo-sign_23-2149272417.jpg?t=st=1732025243~exp=1732028843~hmac=90885c767238b4085c78b33d2e8a8113608c31d3256c30818a26717515635287&w=826'}" alt="${result.alt}" class='w-24 h-20 sm:w-28 sm:h-24 object-cover rounded-lg'>
        </div>
        </div>
        </a>
      `;

    container.appendChild(resultElement);
  });
}

export function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export function attachSearchHandler(inputElement, resultsContainer) {
  const handleSearchInput = debounce(async () => {
    const query = inputElement.value.trim();

    if (!query) {
      resultsContainer.innerHTML = '';
      return;
    }

    try {
      const results = await search(query);

      if (results && results.data) {
        renderSearchResults(resultsContainer, results.data, query);
      } else {
        renderSearchResults(resultsContainer, [], query);
      }
    } catch (error) {
      console.error('Search error:', error.message);
      resultsContainer.textContent = `Error: ${error.message}`;
    }
  }, 300);

  inputElement.addEventListener('input', handleSearchInput);
}
