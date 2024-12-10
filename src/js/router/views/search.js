import { attachSearchHandler } from '../../api/search/search';

const initializeSearch = () => {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  if (searchInput && resultsContainer) {
    attachSearchHandler(searchInput, resultsContainer);
  } else {
    console.error('Search input or results container not found in the DOM.');
  }
};

initializeSearch();
