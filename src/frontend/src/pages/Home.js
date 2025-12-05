import { api } from '../utils/api.js';
import { appState } from '../utils/state.js';
import { createNewsCard } from '../components/NewsCard.js';
import { createSearchBar } from '../components/SearchBar.js';
import { createCategoryFilter } from '../components/CategoryFilter.js';
import { showLoading, showError, showEmpty, createSkeletonCard } from '../components/LoadingStates.js';

export async function renderHomePage() {
    const main = document.createElement('main');
    main.className = 'home-page';

    // Controls section
    const controls = document.createElement('div');
    controls.className = 'container controls-section';

    const searchBar = createSearchBar(handleSearch);
    const categoryFilter = createCategoryFilter(handleCategoryFilter);

    controls.appendChild(searchBar);
    controls.appendChild(categoryFilter);

    // News grid
    const newsSection = document.createElement('div');
    newsSection.className = 'container news-section';
    newsSection.innerHTML = '<div class="news-grid" id="news-grid"></div>';

    // Load more button
    const loadMoreContainer = document.createElement('div');
    loadMoreContainer.className = 'load-more-container';
    loadMoreContainer.innerHTML = `
    <button class="btn-primary load-more-btn" id="load-more-btn" style="display: none;">
      Daha Fazla Yükle
    </button>
  `;

    main.appendChild(controls);
    main.appendChild(newsSection);
    main.appendChild(loadMoreContainer);

    // State
    let currentPage = 1;
    let currentCategory = null;
    let currentSearch = '';
    let totalPages = 1;
    let loading = false;

    // Fetch and render news
    async function fetchNews(append = false) {
        console.log('[DEBUG] fetchNews called, append:', append, 'loading:', loading);
        if (loading) return;
        loading = true;

        const grid = document.getElementById('news-grid');
        console.log('[DEBUG] Grid element:', grid);

        if (!append) {
            // Show skeleton loaders
            grid.innerHTML = '';
            for (let i = 0; i < 6; i++) {
                grid.appendChild(createSkeletonCard());
            }
            console.log('[DEBUG] Skeleton loaders added');
        }

        try {
            const params = {
                page: currentPage,
                limit: 12,
            };

            if (currentCategory) params.category = currentCategory;
            if (currentSearch) params.search = currentSearch;

            console.log('[DEBUG] Fetching news with params:', params);
            const data = await api.getNews(params);
            console.log('[DEBUG] Got data:', data.articles.length, 'articles');

            if (!append) {
                grid.innerHTML = '';
            }

            if (data.articles.length === 0) {
                if (!append) {
                    showEmpty(grid, currentSearch ? 'Arama sonucu bulunamadı' : 'Henüz haber yok');
                }
            } else {
                // Get bookmarks to check which articles are bookmarked
                let bookmarkedIds = [];
                if (appState.get('user')) {
                    try {
                        const bookmarksData = await api.getBookmarks();
                        bookmarkedIds = bookmarksData.bookmarks.map(b => b.articleId);
                    } catch (err) {
                        console.error('Failed to fetch bookmarks:', err);
                    }
                }

                console.log('[DEBUG] Rendering', data.articles.length, 'articles');
                data.articles.forEach((article, index) => {
                    const card = createNewsCard(article, bookmarkedIds.includes(article.id));
                    card.style.animationDelay = `${index * 0.05}s`;
                    grid.appendChild(card);
                });
                console.log('[DEBUG] Articles rendered successfully');
            }

            // Update pagination
            totalPages = data.pagination.pages;
            const loadMoreBtn = document.getElementById('load-more-btn');
            if (currentPage < totalPages) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Failed to fetch news:', error);
            if (!append) {
                showError(grid, 'Haberler yüklenirken bir hata oluştu');
            }
        } finally {
            loading = false;
            console.log('[DEBUG] fetchNews completed, loading:', loading);
        }
    }

    function handleSearch(query) {
        currentSearch = query;
        currentPage = 1;
        fetchNews();
    }

    function handleCategoryFilter(category) {
        currentCategory = category;
        currentPage = 1;
        fetchNews();
    }

    // Load more button
    const loadMoreBtn = main.querySelector('#load-more-btn');
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        fetchNews(true);
    });

    // Initial load - defer until DOM is ready
    setTimeout(() => {
        console.log('[DEBUG] Calling fetchNews after DOM ready');
        fetchNews();
    }, 0);

    return main;
}

export default { renderHomePage };
