import { api } from '../utils/api.js';
import { formatDate } from '../utils/state.js';

export function createNewsCard(article, bookmarked = false) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.setAttribute('data-article-id', article.id);

    const imageUrl = article.imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%231e293b" width="400" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

    card.innerHTML = `
    <div class="card-image" style="background-image: url('${imageUrl}')">
      <span class="category-badge">${article.category}</span>
      <button class="bookmark-btn ${bookmarked ? 'active' : ''}" data-article-id="${article.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
    <div class="card-content">
      <div class="card-meta">
        <span class="source-badge">${article.source}</span>
        <span class="date">${formatDate(article.publishedAt)}</span>
      </div>
      <h3 class="card-title">
        <a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>
      </h3>
      <p class="card-summary">${article.summary || ''}</p>
      ${article.aiSummary ? `
        <div class="ai-summary">
          <div class="ai-badge">🤖 AI Özet</div>
          <p>${article.aiSummary}</p>
        </div>
      ` : ''}
      <div class="card-footer">
        <div class="card-stats">
          ${article.readingTime ? `<span>📖 ${Math.ceil(article.readingTime / 60)} dk</span>` : ''}
          ${article.viewCount ? `<span>👁️ ${article.viewCount}</span>` : ''}
          ${article.sentiment ? `<span class="sentiment-${article.sentiment}">${getSentimentIcon(article.sentiment)}</span>` : ''}
        </div>
        <div class="card-actions">
          <button class="icon-btn share-btn" data-title="${article.title}" data-url="${article.url}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
          <a href="${article.url}" target="_blank" class="read-more">Haberi Oku →</a>
        </div>
      </div>
    </div>
  `;

    // Event listeners
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await toggleBookmark(article.id, bookmarkBtn);
    });

    const shareBtn = card.querySelector('.share-btn');
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareArticle(article.title, article.url);
    });

    return card;
}

function getSentimentIcon(sentiment) {
    const icons = {
        positive: '😊 Pozitif',
        neutral: '😐 Nötr',
        negative: '😔 Negatif',
    };
    return icons[sentiment] || '';
}

async function toggleBookmark(articleId, btn) {
    try {
        const isBookmarked = btn.classList.contains('active');

        if (isBookmarked) {
            // Find and delete bookmark
            const bookmarks = await api.getBookmarks();
            const bookmark = bookmarks.bookmarks.find(b => b.articleId == articleId);
            if (bookmark) {
                await api.deleteBookmark(bookmark.id);
                btn.classList.remove('active');
                btn.querySelector('svg').setAttribute('fill', 'none');
            }
        } else {
            await api.addBookmark(articleId);
            btn.classList.add('active');
            btn.querySelector('svg').setAttribute('fill', 'currentColor');
        }
    } catch (error) {
        console.error('Bookmark error:', error);
        alert('Kaydetme işlemi başarısız oldu.');
    }
}

function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({ title, url }).catch(() => { });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link kopyalandı!');
        });
    }
}

export default { createNewsCard };
