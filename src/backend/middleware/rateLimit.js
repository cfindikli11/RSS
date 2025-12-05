import rateLimit from 'express-rate-limit';
import config from '../config/config.js';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW * 60 * 1000,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limiter for authentication routes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
});

// Search rate limiter
export const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30,
    message: 'Too many search requests, please slow down.',
});

export default {
    apiLimiter,
    authLimiter,
    searchLimiter,
};
