import { api } from '../utils/api.js';
import { appState } from '../utils/state.js';
import { showLoading } from '../components/LoadingStates.js';

export async function renderSettingsPage() {
    const page = document.createElement('div');
    page.className = 'settings-page';

    page.innerHTML = `
    <div class="container">
      <div class="page-header">
        <h1 class="gradient-text">Ayarlar</h1>
        <p class="text-secondary">Hesap ve tercihlerinizi yönetin</p>
      </div>

      <div class="settings-grid">
        <div class="settings-card glass">
          <h3>Profil Bilgileri</h3>
          <div id="profile-section"></div>
        </div>

        <div class="settings-card glass">
          <h3>Tercihler</h3>
          <div id="preferences-section"></div>
        </div>

        <div class="settings-card glass">
          <h3>İstatistikler</h3>
          <div id="stats-section"></div>
        </div>
      </div>
    </div>
  `;

    const profileSection = page.querySelector('#profile-section');
    const preferencesSection = page.querySelector('#preferences-section');
    const statsSection = page.querySelector('#stats-section');

    // Load profile
    try {
        const user = await api.getProfile();
        profileSection.innerHTML = `
      <div class="profile-info">
        <div class="form-group">
          <label>Kullanıcı Adı</label>
          <input type="text" value="${user.username}" readonly>
        </div>
        <div class="form-group">
          <label>E-posta</label>
          <input type="email" value="${user.email}" readonly>
        </div>
        <div class="form-group">
          <label>Rol</label>
          <span class="badge">${user.role === 'admin' ? '👑 Admin' : '👤 Kullanıcı'}</span>
        </div>
      </div>
    `;
    } catch (error) {
        profileSection.innerHTML = '<p class="error-message">Profil yüklenemedi</p>';
    }

    // Load preferences
    try {
        const { preferences } = await api.getPreferences();
        preferencesSection.innerHTML = `
      <div class="preferences-list">
        <div class="preference-item">
          <label>
            <input type="checkbox" ${preferences.autoRefresh ? 'checked' : ''} id="auto-refresh">
            Otomatik Yenileme
          </label>
        </div>
        <div class="preference-item">
          <label>
            <input type="checkbox" ${preferences.notificationsEnabled ? 'checked' : ''} id="notifications">
            Bildirimler
          </label>
        </div>
        <div class="preference-item">
          <label>Varsayılan Kategori</label>
          <select id="default-category">
            <option value="Tümü" ${preferences.defaultCategory === 'Tümü' ? 'selected' : ''}>Tümü</option>
            <option value="Gündem" ${preferences.defaultCategory === 'Gündem' ? 'selected' : ''}>Gündem</option>
            <option value="Dünya" ${preferences.defaultCategory === 'Dünya' ? 'selected' : ''}>Dünya</option>
            <option value="Teknoloji" ${preferences.defaultCategory === 'Teknoloji' ? 'selected' : ''}>Teknoloji</option>
            <option value="Ekonomi" ${preferences.defaultCategory === 'Ekonomi' ? 'selected' : ''}>Ekonomi</option>
            <option value="Bilim" ${preferences.defaultCategory === 'Bilim' ? 'selected' : ''}>Bilim</option>
          </select>
        </div>
        <button class="btn-primary" id="save-preferences">Kaydet</button>
      </div>
    `;

        const saveBtn = page.querySelector('#save-preferences');
        saveBtn.addEventListener('click', async () => {
            const newPreferences = {
                autoRefresh: page.querySelector('#auto-refresh').checked,
                notificationsEnabled: page.querySelector('#notifications').checked,
                defaultCategory: page.querySelector('#default-category').value,
                theme: preferences.theme,
            };

            try {
                await api.updatePreferences(newPreferences);
                alert('Tercihler kaydedildi!');
            } catch (error) {
                alert('Kaydetme başarısız');
            }
        });
    } catch (error) {
        preferencesSection.innerHTML = '<p class="error-message">Tercihler yüklenemedi</p>';
    }

    // Load stats
    try {
        const { stats } = await api.getUserStats();
        statsSection.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${stats.bookmarks}</div>
          <div class="stat-label">Kayıtlı Haber</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.articlesRead}</div>
          <div class="stat-label">Okunan Haber</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${new Date(stats.memberSince).toLocaleDateString('tr-TR')}</div>
          <div class="stat-label">Üyelik Tarihi</div>
        </div>
      </div>
    `;
    } catch (error) {
        statsSection.innerHTML = '<p class="error-message">İstatistikler yüklenemedi</p>';
    }

    return page;
}

export default { renderSettingsPage };
