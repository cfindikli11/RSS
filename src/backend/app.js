import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config/config.js';
import { testConnection, syncDatabase } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';

// Import  routes
import authRoutes from './routes/api/v1/auth.routes.js';
import newsRoutes from './routes/api/v1/news.routes.js';
import feedsRoutes from './routes/api/v1/feeds.routes.js';
import bookmarksRoutes from './routes/api/v1/bookmarks.routes.js';
import userRoutes from './routes/api/v1/user.routes.js';
import adminRoutes from './routes/api/v1/admin.routes.js';
import marketRoutes from './routes/api/v1/market.routes.js';

// Import services
import { startScheduledRefresh } from './services/schedulerService.js';
import { fetchAllFeeds } from './services/rssService.js';

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [config.CORS_ORIGIN, 'http://127.0.0.1:5173', 'http://localhost:5173'];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            // For development, let's be permissive if it matches port 5173
            if (origin.includes('5173')) return callback(null, true);
            // return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use('/api', apiLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/feeds', feedsRoutes);
app.use('/api/v1/bookmarks', bookmarksRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/market', marketRoutes);

// Serve frontend in production
if (config.NODE_ENV === 'production') {
    app.use(express.static('dist/frontend'));
    app.get('*', (req, res) => {
        res.sendFile('index.html', { root: 'dist/frontend' });
    });
}

// Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

// Initialize and start server
async function startServer() {
    try {
        console.log('🚀 Starting Pulse RSS v2 Server...');
        console.log(`📍 Environment: ${config.NODE_ENV}`);

        // Test database connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
            throw new Error('Database connection failed');
        }

        // Sync database (create tables)
        await syncDatabase({ alter: config.NODE_ENV === 'development' });

        // Start listening
        app.listen(config.PORT, () => {
            console.log(`✅ Server running on http://localhost:${config.PORT}`);
            console.log(`🌐 CORS enabled for: ${config.CORS_ORIGIN}`);
            console.log('📡 Scheduled refresh: Every 15 minutes');

            // Start scheduled refresh
            startScheduledRefresh();

            // Initial feed fetch (in background)
            console.log('📰 Fetching initial news (background)...');
            fetchAllFeeds().catch(err => console.error('Initial feed fetch failed:', err));
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

export default app;
