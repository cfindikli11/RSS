# Pulse RSS v2 - Modern News Aggregator

🚀 **A modern, AI-powered RSS feed aggregator built with Node.js, Express, and Vite.**

## Features

- ✨ **Modern Architecture**: Modular backend with clean separation of concerns
- 🔐 **JWT Authentication**: Secure user authentication with refresh tokens
- 📱 **RESTful API**: Well-structured API v1 endpoints
- 🗄️ **Database**: SQLite with Sequelize ORM for easy data management
- 🔄 **Auto-Refresh**: Scheduled feed updates every 15 minutes
- 🌐 **Translation**: Automatic translation of English content to Turkish
- 📊 **User Features**: Bookmarks, reading history, preferences
- 👨‍💻 **Admin Panel**: User management, feed configuration, statistics
- ⚡ **Performance**: Rate limiting, caching, optimized queries
- 🎨 **Modern UI**: Vite-powered frontend with design system
- 📦 **Easy Setup**: Simple configuration and deployment

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd RSS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # .env file is already created, but update JWT_SECRET
   # Edit .env and set a secure JWT_SECRET
   ```

4. **Seed database with default feeds**
   ```bash
   node src/backend/scripts/seed.js
   ```

5. **Run the application**
   
   **Development mode** (with hot-reload for both frontend and backend):
   ```bash
   npm run dev
   ```
   
   - Backend: http://localhost:3000
   - Frontend: http://localhost:5173

   **Backend only:**
   ```bash
   npm run dev:backend
   ```

   **Frontend only:**
   ```bash
   npm run dev:frontend
   ```

6. **Build for production**
   ```bash
   npm run build:frontend
   npm start
   ```

## **Project Structure**

```
RSS/
├── src/
│   ├── backend/
│   │   ├── config/           # Configuration files
│   │   │   ├── config.js     # Environment config
│   │   │   └── database.js   # Database connection
│   │   ├── controllers/      # Route controllers (future expansion)
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.js       # JWT authentication
│   │   │   ├── rateLimit.js  # Rate limiting
│   │   │   ├── validate.js   # Input validation
│   │   │   └── errorHandler.js
│   │   ├── models/           # Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Feed.js
│   │   │   ├── Article.js
│   │   │   ├── Bookmark.js
│   │   │   ├── ReadingHistory.js
│   │   │   └── index.js      # Model associations
│   │   ├── routes/
│   │   │   └── api/v1/       # API v1 routes
│   │   │       ├── auth.routes.js
│   │   │       ├── news.routes.js
│   │   │       ├── feeds.routes.js
│   │   │       ├── bookmarks.routes.js
│   │   │       ├── user.routes.js
│   │   │       └── admin.routes.js
│   │   ├── services/         # Business logic
│   │   │   ├── rssService.js
│   │   │   ├── translationService.js
│   │   │   └── schedulerService.js
│   │   ├── scripts/          # Utility scripts
│   │   │   └── seed.js       # Database seeding
│   │   └── app.js            # Express app entry
│   └── frontend/
│       ├── public/           # Static assets
│       ├── src/
│       │   ├── components/   # Reusable components
│       │   ├── pages/        # Page views
│       │   ├── styles/       # CSS
│       │   │   ├── design-system.css
│       │   │   └── main.css
│       │   ├── utils/        # Utilities
│       │   └── main.js       # App entry
│       └── index.html
├── data/                     # SQLite database (auto-created)
├── .env                      # Environment variables
├── .env.example              # Environment template
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies & scripts
└── README.md

```

## API Documentation

### Authentication

- **POST** `/api/v1/auth/signup` - Register new user
- **POST** `/api/v1/auth/login` - Login and get JWT token

### News

- **GET** `/api/v1/news` - Get news (paginated, filterable)
- **GET** `/api/v1/news/:id` - Get single article
- **POST** `/api/v1/news/search` - Advanced search

### Feeds (Admin)

- **GET** `/api/v1/feeds` - List feeds
- **POST** `/api/v1/feeds` - Add new feed (admin)
- **PUT** `/api/v1/feeds/:id` - Update feed (admin)
- **DELETE** `/api/v1/feeds/:id` - Delete feed (admin)

### Bookmarks (Auth required)

- **GET** `/api/v1/bookmarks` - Get user bookmarks
- **POST** `/api/v1/bookmarks` - Add bookmark
- **PUT** `/api/v1/bookmarks/:id` - Update bookmark
- **DELETE** `/api/v1/bookmarks/:id` - Delete bookmark

### User (Auth required)

- **GET** `/api/v1/user/profile` - Get profile
- **PUT** `/api/v1/user/profile` - Update profile
- **GET** `/api/v1/user/preferences` - Get preferences
- **PUT** `/api/v1/user/preferences` - Update preferences
- **GET** `/api/v1/user/stats` - Get user statistics

### Admin (Admin only)

- **GET** `/api/v1/admin/users` - List all users
- **DELETE** `/api/v1/admin/users/:id` - Delete user
- **POST** `/api/v1/admin/feeds/refresh` - Trigger manual refresh
- **GET** `/api/v1/admin/stats` - Platform statistics

## Default RSS Feeds

The application comes with 14 pre-configured news sources:

**Turkish Sources:**
- BBC Türkçe (Dünya)
- Anadolu Ajansı (Gündem)
- Webrazzi (Teknoloji)
- ShiftDelete (Teknoloji)
- Bloomberg HT (Ekonomi)
- Evrim Ağacı (Bilim)

**English Sources (auto-translated):**
- BBC World (Dünya)
- NYT (Dünya)
- CNN (Dünya)
- Al Jazeera (Dünya)
- TechCrunch (Teknoloji)
- The Verge (Teknoloji)
- Bloomberg (Ekonomi)
- Wired (Bilim)

## Environment Variables

See `.env.example` for all available options. Key variables:

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - **REQUIRED** Secret for JWT tokens
- `DATABASE_URL` - SQLite database path
- `CORS_ORIGIN` - Frontend URL for CORS
- `OPENAI_API_KEY` - (Optional) For AI features
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

## Development

### Running Tests
```bash
npm test  # (To be implemented)
```

### Database Migrations
```bash
# The database auto-syncs in development
# For production, use: syncDatabase({ force: false })
```

### Seeding Data
```bash
node src/backend/scripts/seed.js
```

### Legacy Server
To run the old v1 server:
```bash
npm run legacy
```

## Deployment

1. Build frontend:
   ```bash
   npm run build:frontend
   ```

2. Set environment to production in `.env`:
   ```
   NODE_ENV=production
   ```

3. Start server:
   ```bash
   npm start
   ```

## Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **Sequelize** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **node-cron** - Scheduled tasks
- **rss-parser** - RSS feed parsing
- **bcryptjs** - Password hashing

### Frontend
- **Vite** - Build tool
- **Vanilla JavaScript** - Framework-free
- **Modern CSS** - Design system with CSS variables

## Roadmap

- [ ] **AI Features**: Smart summaries, sentiment analysis
- [ ] **PWA**: Offline support, push notifications
- [ ] **Social Features**: Share collections, discussions
- [ ] **Analytics**: Reading patterns, popular topics
- [ ] **Mobile App**: React Native wrapper
- [ ] **Multi-language**: Support for more languages

## Migration from v1

The v2 application runs alongside v1. To migrate:

1. Export users from `users.json`
2. Import into new database via API
3. Switch traffic to v2 endpoints
4. Remove old `server.js` once confirmed

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the wiki for documentation
- Contact the development team

---

**Built with ❤️ using modern web technologies**
