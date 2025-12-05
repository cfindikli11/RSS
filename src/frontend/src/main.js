import './styles/design-system.css';
import './styles/components.css';
import './styles/main.css';

import { appState } from './utils/state.js';
import { api } from './utils/api.js';
import { createHeader, updateHeader } from './components/Header.js';
import { renderHomePage } from './pages/Home.js';
import { renderLoginPage } from './pages/Login.js';
import { renderSignupPage } from './pages/Signup.js';
import { renderBookmarksPage } from './pages/Bookmarks.js';
import { renderSettingsPage } from './pages/Settings.js';
import { renderAdminPage } from './pages/Admin.js';

// Router configuration
const routes = {
  '/': { render: renderHomePage, requiresAuth: false },
  '/login': { render: renderLoginPage, requiresAuth: false },
  '/signup': { render: renderSignupPage, requiresAuth: false },
  '/bookmarks': { render: renderBookmarksPage, requiresAuth: true },
  '/settings': { render: renderSettingsPage, requiresAuth: true },
  '/admin': { render: renderAdminPage, requiresAuth: true, requiresAdmin: true },
};

// Navigation handler
export function navigate(path, replace = false) {
  if (replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }
  renderApp();
}

// Main render function
async function renderApp() {
  const path = window.location.pathname;
  const route = routes[path] || routes['/'];

  // Check authentication requirements
  const user = appState.get('user');

  if (route.requiresAuth && !user) {
    navigate('/login', true);
    return;
  }

  if (route.requiresAdmin && user?.role !== 'admin') {
    navigate('/', true);
    return;
  }

  // Render layout
  const app = document.getElementById('app');
  app.innerHTML = '';

  // Add header (except for auth pages)
  if (path !== '/login' && path !== '/signup') {
    app.appendChild(createHeader());
  }

  // Render page content
  const pageContent = await route.render();
  app.appendChild(pageContent);

  // Setup route link handlers
  setupRouteLinks();
}

// Setup client-side routing for all links
function setupRouteLinks() {
  document.querySelectorAll('a[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('href');
      navigate(path);
    });
  });
}

// Initialize app
async function init() {
  console.log('🚀 Pulse RSS v2 - Initializing...');

  // Check authentication
  const token = localStorage.getItem('pulse_token');
  if (token) {
    try {
      const user = await api.getProfile();
      appState.setUser(user);
      console.log('✅ User authenticated:', user.username);
    } catch (error) {
      console.log('❌ Auth check failed, clearing token');
      api.logout();
    }
  }

  // Initialize theme
  appState.setTheme(appState.get('theme'));

  // Handle browser back/forward
  window.addEventListener('popstate', renderApp);

  // Initial render
  await renderApp();

  console.log('✅ Application initialized');
}

// Start the app
init();
