import { debounce } from '../utils/state.js';

export function createSearchBar(onSearch) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';

    searchContainer.innerHTML = `
    <div class="search-wrapper">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input 
        type="text" 
        id="search-input" 
        class="search-input" 
        placeholder="Haberlerde ara..."
        autocomplete="off"
      >
      <button class="clear-search" id="clear-search" style="display: none;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

    const input = searchContainer.querySelector('#search-input');
    const clearBtn = searchContainer.querySelector('#clear-search');

    const debouncedSearch = debounce((value) => {
        onSearch(value);
    }, 300);

    input.addEventListener('input', (e) => {
        const value = e.target.value;
        clearBtn.style.display = value ? 'block' : 'none';
        debouncedSearch(value);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        onSearch('');
    });

    return searchContainer;
}

export default { createSearchBar };
