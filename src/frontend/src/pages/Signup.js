import { api } from '../utils/api.js';
import { appState } from '../utils/state.js';

export function renderSignupPage() {
    const page = document.createElement('div');
    page.className = 'auth-page';

    page.innerHTML = `
    <div class="auth-container">
      <div class="auth-card glass">
        <div class="auth-header">
          <h1 class="gradient-text">Kayıt Ol</h1>
          <p class="text-secondary">Yeni hesap oluşturun</p>
        </div>

        <form id="signup-form" class="auth-form">
          <div class="form-group">
            <label for="username">Kullanıcı Adı</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              required 
              minlength="3"
              autocomplete="username"
              placeholder="kullaniciadi"
            >
          </div>

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
              minlength="6"
              autocomplete="new-password"
              placeholder="En az 6 karakter"
            >
          </div>

          <div class="error-message" id="error-message" style="display: none;"></div>

          <button type="submit" class="btn-primary btn-full">
            Kayıt Ol
          </button>
        </form>

        <div class="auth-footer">
          <p>Zaten hesabınız var mı? <a href="/login" data-route="/login">Giriş Yap</a></p>
        </div>
      </div>
    </div>
  `;

    const form = page.querySelector('#signup-form');
    const errorDiv = page.querySelector('#error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';

        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Kayıt yapılıyor...';

        try {
            const data = await api.signup(username, email, password);
            appState.setUser(data.user);
            window.location.href = '/';
        } catch (error) {
            errorDiv.textContent = error.message || 'Kayıt başarısız oldu';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Kayıt Ol';
        }
    });

    return page;
}

export default { renderSignupPage };
