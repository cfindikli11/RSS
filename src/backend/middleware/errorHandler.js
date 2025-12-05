import config from '../config/config.js';

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.errors.map(e => ({ field: e.path, message: e.message })),
        });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            error: 'Resource already exists',
            field: err.errors[0]?.path,
        });
    }

    // JWT errors (in case they weren't caught by auth middleware)
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        error: message,
        ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const notFound = (req, res) => {
    res.status(404).json({ error: 'Route not found' });
};

export default errorHandler;
