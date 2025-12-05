import { api } from '../utils/api.js';
import { createNewsCard } from '../components/NewsCard.js';
import { showLoading, showEmpty } from '../components/LoadingStates.js';

export async function renderBookmarksPage() {
    const page = document.createElement('div');
    page.className = 'bookmarks-page';

    page.innerHTML = `
    <div class="container">
      <div class="page-header">
        <h1 class="gradient-text">Kaydedilenler</h1>
        <p class="text-secondary">Kaydedilmiş haberleriniz</p>
      </div>
      <div class="news-grid" id="bookmarks-grid"></div>
    </div>
  `;

    const grid = page.querySelector('#bookmarks-grid');
    showLoading(grid);

    try {
        const data = await api.getBookmarks();

        grid.innerHTML = '';

        if (data.bookmarks.length === 0) {
            showEmpty(grid, 'Henüz kayıtlı haberiniz yok');
        } else {
            data.bookmarks.forEach((bookmark, index) => {
                const card = createNewsCard(bookmark.article, true);
                card.style.animationDelay = `${index * 0.05}s`;
                grid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
        grid.innerHTML = `
      <div class="error-container">
        <p>Kaydedilenler yüklenirken bir hata oluştu</p>
        <button class="btn-primary" onclick="window.location.reload()">Tekrar Dene</button>
      </div>
    `;
    }

    return page;
}

export default { renderBookmarksPage };
