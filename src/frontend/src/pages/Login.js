import { api } from '../utils/api.js';
import { appState } from '../utils/state.js';

export function renderLoginPage() {
    const page = document.createElement('div');
    page.className = 'auth-page';

    page.innerHTML = `
    <div class="auth-container">
      <div class="auth-card glass">
        <div class="auth-header">
          <h1 class="gradient-text">Giriş Yap</h1>
          <p class="text-secondary">Pulse hesabınıza giriş yapın</p>
        </div>

        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label for="email">E-posta</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              autocomplete="email"
              placeholder="ornek@email.com"
            >
          </div>

          <div class="form-group">
            <label for="password">Şifre</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              autocomplete="current-password"
              placeholder="••••••••"
            >
          </div>

          <div class="error-message" id="error-message" style="display: none;"></div>

          <button type="submit" class="btn-primary btn-full">
            Giriş Yap
          </button>
        </form>

        <div class="auth-footer">
          <p>Hesabınız yok mu? <a href="/signup" data-route="/signup">Kayıt Ol</a></p>
        </div>
      </div>
    </div>
  `;

    const form = page.querySelector('#login-form');
    const errorDiv = page.querySelector('#error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';

        const email = form.email.value;
        const password = form.password.value;
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Giriş yapılıyor...';

        try {
            const data = await api.login(email, password);
            appState.setUser(data.user);
            window.location.href = '/';
        } catch (error) {
            errorDiv.textContent = error.message || 'Giriş başarısız oldu';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Giriş Yap';
        }
    });

    return page;
}

export default { renderLoginPage };
