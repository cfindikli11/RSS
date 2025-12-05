import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../../.env') });

export const config = {
    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),

    // Database
    DATABASE_URL: process.env.DATABASE_URL || 'sqlite://./data/rss.db',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

    // API Keys
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,

    // Cache
    REDIS_URL: process.env.REDIS_URL,
    ENABLE_REDIS: process.env.ENABLE_REDIS === 'true',

    // Translation
    TRANSLATION_CACHE_TTL: parseInt(process.env.TRANSLATION_CACHE_TTL || '86400', 10),

    // RSS
    FEED_REFRESH_INTERVAL: parseInt(process.env.FEED_REFRESH_INTERVAL || '900000', 10), // 15 minutes
    FEED_TIMEOUT: parseInt(process.env.FEED_TIMEOUT || '10000', 10),

    // Rate Limiting
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

// Validate critical configuration
if (config.NODE_ENV === 'production' && config.JWT_SECRET === 'your-secret-key-change-this') {
    console.error('❌ CRITICAL: Please set a secure JWT_SECRET in production!');
    process.exit(1);
}

export default config;
