import { API_AUCTION_LISTINGS } from '../constants';
import { displayLoading, hideLoading } from '../../UI/loading';

/**
 * Tries to search for listings by sending a GET request to the API_AUCTION_LISTINGS/search endpoint.
 * Appends the query string and additional parameters for fetching bid details.
 * If successful, it returns the result data in JSON format.
 * If unsuccessful, it throws an error with a error message.
 *
 * @async
 * @param {string} query - The query search typed inside the input field.
 * @returns {Promise<Object|null>} - A promise that resolves to the search data in JSON format, or `null` if the update fails or the ID is not found.
 * @throws {Error} - Throws an error if the search request fails or the response is not OK.
 */

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

/**
 * Displays the search results retrieved from the search function, by creating and appending HTML elements
 * to dynamically generate the results.
 *
 * - If no results are found, it displays a message indicating that no listings match the search query.
 * - Results include links to the respective listing pages.
 *
 * @param {HTMLElement} container - The DOM element where search results will be rendered.
 * @param {Array<Object>} results - An array of search results returned by the `search` function.
 * @param {string} query - The query search typed inside the input field.
 * @returns {Promise<void>} - Resolves when the profile details have been successfully rendered in the DOM.
 */

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

/**
 * Creates a debounced version of a function, which delays the calling of the provided function
 * until after the delay has elapsed since the last time the debounced function was called.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay execution.
 * @returns {Function} - A debounced version of the provided function
 */

export function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
/**
 * Tries to retrieve the results from the search request, and then render the search results to
 * display the results to the user.
 * The search request is debounced with a delay of 300 milliseconds to prevent excessive API calls.
 *
 * - If the input field is empty, it clears the results container.
 * - If the search is successful, it renders the results in the specified results container using `renderSearchResults`.
 * - If the search fails, it logs the error to the console and displays an error message in the results container.
 *
 * @param {HTMLInputElement} inputElement - The input element where users type their search query.
 * @param {HTMLElement} resultsContainer - The container where the search results will be displayed.
 * @returns {void} - This function does not return a value.
 */

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
