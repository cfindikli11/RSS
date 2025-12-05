import express from 'express';
import { body } from 'express-validator';
import { User } from '../../../models/index.js';
import { generateToken } from '../../../middleware/auth.js';
import { validate } from '../../../middleware/validate.js';
import { authLimiter } from '../../../middleware/rateLimit.js';

const router = express.Router();

// Validation rules
const signupValidation = [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
];

// POST /api/v1/auth/signup
router.post('/signup', authLimiter, signupValidation, validate, async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password, // Will be hashed by model hook
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/auth/login
router.post('/login', authLimiter, loginValidation, validate, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Generate token
        const token = generateToken(user.id);

        res.json({
            message: 'Login successful',
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        next(error);
    }
});

export default router;
