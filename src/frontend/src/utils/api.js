// API client for backend communication
const API_BASE = ''; // Use proxy (relative path)


class APIClient {
    constructor() {
        this.token = localStorage.getItem('pulse_token');
    }

    get baseURL() {
        return API_BASE;
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('pulse_token', token);
        } else {
            localStorage.removeItem('pulse_token');
        }
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    async signup(username, email, password) {
        const data = await this.request('/api/v1/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
        this.setToken(data.token);
        return data;
    }

    async login(email, password) {
        const data = await this.request('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.token);
        return data;
    }

    logout() {
        this.setToken(null);
        localStorage.removeItem('pulse_user');
    }

    // News
    async getNews(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/api/v1/news?${query}`);
    }

    async getArticle(id) {
        return this.request(`/api/v1/news/${id}`);
    }

    async searchNews(query, filters = {}) {
        return this.request('/api/v1/news/search', {
            method: 'POST',
            body: JSON.stringify({ query, filters }),
        });
    }

    // Bookmarks
    async getBookmarks() {
        return this.request('/api/v1/bookmarks');
    }

    async addBookmark(articleId, tags = [], notes = '') {
        return this.request('/api/v1/bookmarks', {
            method: 'POST',
            body: JSON.stringify({ articleId, tags, notes }),
        });
    }

    async deleteBookmark(id) {
        return this.request(`/api/v1/bookmarks/${id}`, {
            method: 'DELETE',
        });
    }

    // User
    async getProfile() {
        return this.request('/api/v1/user/profile');
    }

    async updateProfile(data) {
        return this.request('/api/v1/user/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getPreferences() {
        return this.request('/api/v1/user/preferences');
    }

    async updatePreferences(preferences) {
        return this.request('/api/v1/user/preferences', {
            method: 'PUT',
            body: JSON.stringify(preferences),
        });
    }

    async getUserStats() {
        return this.request('/api/v1/user/stats');
    }

    // Admin
    async getUsers() {
        return this.request('/api/v1/admin/users');
    }

    async deleteUser(id) {
        return this.request(`/api/v1/admin/users/${id}`, {
            method: 'DELETE',
        });
    }

    async refreshFeeds() {
        return this.request('/api/v1/admin/feeds/refresh', {
            method: 'POST',
        });
    }

    async getAdminStats() {
        return this.request('/api/v1/admin/stats');
    }
}

export const api = new APIClient();
