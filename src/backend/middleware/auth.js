import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { User } from '../models/index.js';

export const auth = async (req, res, next) => {
    try {
        // Get token from header or cookie
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : req.cookies?.token;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Get user from database
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(500).json({ error: 'Authentication failed' });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : req.cookies?.token;

        if (token) {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (user) {
                req.user = user;
            }
        }
    } catch (error) {
        // Silently fail for optional auth
    }
    next();
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
};

export const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId, type: 'refresh' }, config.JWT_SECRET, {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });
};
