export function showLoading(container) {
    container.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Yükleniyor...</p>
    </div>
  `;
}

export function showError(container, message) {
    container.innerHTML = `
    <div class="error-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p class="error-message">${message}</p>
      <button class="btn-primary" onclick="window.location.reload()">Tekrar Dene</button>
    </div>
  `;
}

export function showEmpty(container, message = 'Henüz haber yok') {
    container.innerHTML = `
    <div class="empty-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <p class="empty-message">${message}</p>
    </div>
  `;
}

export function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'news-card skeleton';
    card.innerHTML = `
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-line" style="width: 60%"></div>
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 80%"></div>
      <div class="skeleton-line" style="width: 40%"></div>
    </div>
  `;
    return card;
}

export default {
    showLoading,
    showError,
    showEmpty,
    createSkeletonCard,
};
