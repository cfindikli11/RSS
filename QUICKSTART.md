# Pulse RSS v2 - Quick Start Guide

## 🚀 Getting Started

### Step 1: Install Dependencies (if not already done)
```bash
npm install
```

### Step 2: Start the Application

**Option A: Run Both Frontend & Backend Together** (Recommended)
```bash
npm run dev
```

**Option B: Run Separately**

Terminal 1 - Backend API:
```bash
npm run dev:backend
```

Terminal 2 - Frontend Server:
```bash
npm run dev:frontend
```

### Step 3: Open in Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## 📋 What You Get

### ✅ Complete Backend API
- **Database**: SQLite with 5 models (User, Feed, Article, Bookmark, ReadingHistory)
- **Endpoints**: 20+ RESTful API routes
- **Features**:
  - JWT authentication
  - Auto-refresh feeds every 15 min
  - Auto-translation (EN → TR)
  - Rate limiting
  - Input validation
  - Error handling

### ✅ Modern Frontend App
- **Framework**: Vanilla JS + Vite (no framework dependencies)
- **Components**: 8 reusable components
- **Pages**: 6 fully functional pages
- **Features**:
  - Client-side routing
  - Auth guards
  - Responsive design
  - Dark/Light themes
  - Real-time search
  - Category filtering
  - Pagination
  - Bookmark management

---

## 🧪 Testing the App

### 1. Create an Account
1. Go to http://localhost:5173
2. Click "Kayıt Ol" (Sign Up)
3. Fill in username, email, password
4. Submit → You'll be logged in automatically!

### 2. Browse News
- Search articles
- Filter by category (Teknoloji, Dünya, etc.)
- Bookmark articles (heart icon)
- Share articles
- Load more with pagination

### 3. User Features
- **Bookmarks**: Click bookmark icon → Visit `/bookmarks`
- **Settings**: Update preferences, view stats
- **Logout**: User menu → Çıkış Yap

### 4. Admin Features (First user is admin)
1. Create first account → Auto-assigned admin role
   ```bash
   # Or manually make user admin:
   # Edit users.json and set "role": "admin"
   ```
2. Access `/admin` panel
3. View platform stats
4. Manage users
5. Trigger manual feed refresh

---

## 🛠️ Useful Commands

```bash
# Development (with hot-reload)
npm run dev                # Both servers
npm run dev:backend        # Backend only
npm run dev:frontend       # Frontend only

# Production Build
npm run build:frontend     # Build frontend
npm start                  # Serve production (backend + built frontend)

# Database
node src/backend/scripts/seed.js   # Seed feeds

# Legacy v1 server
npm run legacy
```

---

## 📁 Project Structure

```
RSS/
├── src/
│   ├── backend/           # Node.js API
│   │   ├── app.js         # Express server
│   │   ├── config/        # Config & DB
│   │   ├── models/        # Sequelize models
│   │   ├── middleware/    # Auth, validation, etc.
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   └── scripts/       # Utilities
│   └── frontend/          # Vite app
│       ├── index.html
│       └── src/
│           ├── components/    # Reusable UI
│           ├── pages/         # Page views
│           ├── styles/        # CSS
│           └── utils/         # Helpers
├── data/                  # SQLite DB (auto-created)
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎯 API Endpoints

### Public
- `POST /api/v1/auth/signup` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/news` - Get news (optional auth)

### Authenticated
- `GET /api/v1/bookmarks` - Get bookmarks
- `POST /api/v1/bookmarks` - Add bookmark
- `GET /api/v1/user/profile` - Get profile
- `PUT /api/v1/user/preferences` - Update preferences

### Admin Only
- `GET /api/v1/admin/users` - List users
- `DELETE /api/v1/admin/users/:id` - Delete user
- `POST /api/v1/admin/feeds/refresh` - Refresh feeds
- `POST /api/v1/feeds` - Add new feed

**Full API docs**: See [README.md](file:///Users/caglarfindikli/RSS/README.md)

---

## 🎨 Features Showcase

### News Feed
- Grid layout with smooth animations
- Skeleton loaders while fetching
- Infinite scroll (load more button)
- Real-time search (debounced)
- Category filtering
- Bookmark toggle

### User Experience
- **Themes**: Dark (default) + Light mode
- **Responsive**: Desktop, tablet, mobile
- **Fast**: Vite HMR, optimized builds
- **Modern**: Glassmorphism, gradients, smooth transitions

### Security
- JWT tokens (7-day expiry)
- Password hashing (bcrypt)
- Rate limiting (100 req/15min)
- Input validation
- CORF configured
- XSS protection

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

### Frontend won't connect to backend
```bash
# Check vite.config.js proxy settings
# Should proxy /api to http://localhost:3000
```

### Database errors
```bash
# Delete database and reseed
rm -rf data/
node src/backend/scripts/seed.js
```

### No news showing
```bash
# Wait 30 seconds for initial fetch
# Or trigger manual refresh in admin panel
```

---

## 🚢 Deployment

### Deploy to Production

1. **Build frontend**:
   ```bash
   npm run build:frontend
   ```

2. **Set environment**:
   ```env
   NODE_ENV=production
   JWT_SECRET=<strong-secret-here>
   PORT=3000
   ```

3. **Start server**:
   ```bash
   npm start
   # Or use PM2:
   # pm2 start src/backend/app.js --name pulse-rss
   ```

4. **Serve with Nginx** (optional):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 📚 Next Steps

### Recommended Enhancements
1. **AI Features** (requires API keys):
   - Add OPENAI_API_KEY to `.env`
   - Implement smart summaries in `rssService.js`
   
2. **PWA**: Add service worker for offline support

3. **Analytics**: Track user behavior with Google Analytics

4. **Email**: Add password reset, email verification

5. **Social**: Add comments, user profiles

---

## 💡 Tips

- **First user becomes admin** - Create your account first!
- **Feeds refresh automatically** every 15 minutes
- **Search is instant** - Uses debouncing for performance
- **Bookmarks saved locally** until you create an account
- **Theme persists** across sessions (localStorage)

---

## 🎉 You're All Set!

The application is now fully functional with:
- ✅ 14 RSS feeds automatically updating
- ✅ User authentication & authorization
- ✅ Modern, responsive UI
- ✅ Admin panel for management
- ✅ Bookmark & preference system
- ✅ Production-ready architecture

**Enjoy your modern news aggregator!** 🚀

Need help? Check the full [README.md](file:///Users/caglarfindikli/RSS/README.md) or [walkthrough.md](file:///Users/caglarfindikli/.gemini/antigravity/brain/3b146a56-891e-49f3-8813-122fd45d3bc6/walkthrough.md).
