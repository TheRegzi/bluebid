import { API_AUCTION_LISTINGS } from '../constants';

export async function search(query) {
  const apiUrl = `${API_AUCTION_LISTINGS}/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(apiUrl, {
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
    resultElement.classList.add('mt-2');

    resultElement.innerHTML = `
        <h3>${result.title}</h3>
        <p>${result.description || 'No description available.'}</p>
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
