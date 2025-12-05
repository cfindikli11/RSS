import { api } from '../utils/api.js';
import { showLoading } from '../components/LoadingStates.js';

export async function renderAdminPage() {
    const page = document.createElement('div');
    page.className = 'admin-page';

    page.innerHTML = `
    <div class="container">
      <div class="page-header">
        <h1 class="gradient-text">Admin Paneli</h1>
        <p class="text-secondary">Platform yönetimi</p>
      </div>

      <div class="admin-grid">
        <div class="admin-card glass">
          <h3>Platform İstatistikleri</h3>
          <div id="admin-stats"></div>
        </div>

        <div class="admin-card glass">
          <h3>Kullanıcılar</h3>
          <div id="users-list"></div>
        </div>

        <div class="admin-card glass">
          <h3>Feed Yönetimi</h3>
          <div id="feed-management">
            <button class="btn-primary" id="refresh-feeds">
              🔄 Feedleri Yenile
            </button>
            <p class="text-secondary" style="margin-top: 1rem;">Manuel feed yenileme işlemi başlat</p>
          </div>
        </div>
      </div>
    </div>
  `;

    const statsDiv = page.querySelector('#admin-stats');
    const usersDiv = page.querySelector('#users-list');
    const refreshBtn = page.querySelector('#refresh-feeds');

    // Load stats
    try {
        const { stats } = await api.getAdminStats();
        statsDiv.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${stats.users}</div>
          <div class="stat-label">Toplam Kullanıcı</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.feeds}</div>
          <div class="stat-label">Toplam Feed</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.activeFeeds}</div>
          <div class="stat-label">Aktif Feed</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.totalArticles}</div>
          <div class="stat-label">Toplam Haber</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.recentArticles || 0}</div>
          <div class="stat-label">Son 24 Saat</div>
        </div>
      </div>
    `;
    } catch (error) {
        statsDiv.innerHTML = '<p class="error-message">İstatistikler yüklenemedi</p>';
    }

    // Load users
    try {
        const { users } = await api.getUsers();
        usersDiv.innerHTML = `
      <table class="users-table">
        <thead>
          <tr>
            <th>Kullanıcı</th>
            <th>E-posta</th>
            <th>Rol</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td><span class="badge">${user.role === 'admin' ? '👑 Admin' : '👤 Kullanıcı'}</span></td>
              <td>
                ${user.role !== 'admin' ? `
                  <button class="btn-danger btn-sm delete-user" data-id="${user.id}" data-email="${user.email}">
                    Sil
                  </button>
                ` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

        // Delete user handlers
        page.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', async () => {
                const email = btn.dataset.email;
                if (confirm(`${email} kullanıcısını silmek istediğinize emin misiniz?`)) {
                    try {
                        await api.deleteUser(btn.dataset.id);
                        window.location.reload();
                    } catch (error) {
                        alert('Silme işlemi başarısız');
                    }
                }
            });
        });
    } catch (error) {
        usersDiv.innerHTML = '<p class="error-message">Kullanıcılar yüklenemedi</p>';
    }

    // Refresh feeds
    refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        refreshBtn.textContent = '🔄 Yenileniyor...';

        try {
            await api.refreshFeeds();
            alert('Feedler başarıyla yenilendi!');
            refreshBtn.textContent = '✅ Tamamlandı';
            setTimeout(() => {
                refreshBtn.disabled = false;
                refreshBtn.textContent = '🔄 Feedleri Yenile';
            }, 2000);
        } catch (error) {
            alert('Yenileme başarısız');
            refreshBtn.disabled = false;
            refreshBtn.textContent = '🔄 Feedleri Yenile';
        }
    });

    return page;
}

export default { renderAdminPage };
