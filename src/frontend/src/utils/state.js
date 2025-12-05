// Simple event emitter for state management
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
}

// Global app state
class AppState extends EventEmitter {
    constructor() {
        super();
        this.state = {
            user: null,
            theme: localStorage.getItem('pulse_theme') || 'dark',
            currentPage: window.location.pathname,
            loading: false,
            error: null,
        };
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        this.state[key] = value;
        this.emit('change', { key, value });
        this.emit(`change:${key}`, value);
    }

    setUser(user) {
        this.set('user', user);
        if (user) {
            localStorage.setItem('pulse_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('pulse_user');
        }
    }

    setTheme(theme) {
        this.set('theme', theme);
        localStorage.setItem('pulse_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    toggleTheme() {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setLoading(loading) {
        this.set('loading', loading);
    }

    setError(error) {
        this.set('error', error);
    }
}

export const appState = new AppState();

// Helper functions
export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;

    return date.toLocaleDateString('tr-TR');
}

export function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
