import { appState } from '../utils/state.js';
import { api } from '../utils/api.js';
import { MarketTicker } from './MarketTicker.js';

export function createHeader() {
  const header = document.createElement('header');
  header.className = 'app-header glass';
  header.innerHTML = `
    <div class="container header-content">
      <div class="logo">
        <h1 class="gradient-text">Pulse</h1>
        <span class="subtitle">v2.0</span>
      </div>
      
      <nav class="nav-menu">
        <a href="/" class="nav-link" data-route="/">Ana Sayfa</a>
        <a href="/bookmarks" class="nav-link" data-route="/bookmarks">Kaydedilenler</a>
        ${appState.get('user')?.role === 'admin' ? '<a href="/admin" class="nav-link" data-route="/admin">Admin</a>' : ''}
      </nav>

      <div class="header-actions">
        <div id="market-ticker-container"></div>
        <button class="icon-btn theme-toggle" id="theme-toggle" title="Tema Değiştir">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${appState.get('theme') === 'dark' ?
      '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>' :
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'
    }
          </svg>
        </button>

        <div class="user-menu" id="user-menu">
          ${appState.get('user') ? `
            <button class="user-avatar" id="user-avatar">
              ${appState.get('user').username.charAt(0).toUpperCase()}
            </button>
            <div class="dropdown-menu" id="user-dropdown">
              <div class="dropdown-item user-info">
                <strong>${appState.get('user').username}</strong>
                <small>${appState.get('user').email}</small>
              </div>
              <hr>
              <a href="/settings" class="dropdown-item" data-route="/settings">⚙️ Ayarlar</a>
              <button class="dropdown-item" id="logout-btn">🚪 Çıkış Yap</button>
            </div>
          ` : `
            <a href="/login" class="btn-secondary" data-route="/login">Giriş</a>
            <a href="/signup" class="btn-primary" data-route="/signup">Kayıt Ol</a>
          `}
        </div>
      </div>
    </div>
  `;

  // Event listeners
  const themeToggle = header.querySelector('#theme-toggle');
  themeToggle.addEventListener('click', () => {
    appState.toggleTheme();
    updateHeader();
  });

  // Initialize Market Ticker
  const tickerContainer = header.querySelector('#market-ticker-container');
  if (tickerContainer) {
    const ticker = new MarketTicker();
    tickerContainer.appendChild(ticker.render());
  }

  const logoutBtn = header.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      api.logout();
      appState.setUser(null);
      window.location.href = '/';
    });
  }

  const userAvatar = header.querySelector('#user-avatar');
  const userDropdown = header.querySelector('#user-dropdown');
  if (userAvatar && userDropdown) {
    userAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      userDropdown.classList.remove('show');
    });
  }

  return header;
}

export function updateHeader() {
  const existingHeader = document.querySelector('.app-header');
  if (existingHeader) {
    const newHeader = createHeader();
    existingHeader.replaceWith(newHeader);
  }
}

export default { createHeader, updateHeader };
