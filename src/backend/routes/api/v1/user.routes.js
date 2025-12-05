import express from 'express';
import { User, ReadingHistory, Bookmark } from '../../../models/index.js';
import { auth } from '../../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/v1/user/profile - Get user profile
router.get('/profile', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// PUT /api/v1/user/profile - Update profile
router.put('/profile', async (req, res, next) => {
    try {
        const { username, avatarUrl } = req.body;

        await req.user.update({ username, avatarUrl });

        res.json({
            user: req.user.toJSON(),
            message: 'Profile updated successfully'
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/v1/user/preferences - Get preferences
router.get('/preferences', (req, res) => {
    res.json({ preferences: req.user.preferences });
});

// PUT /api/v1/user/preferences - Update preferences
router.put('/preferences', async (req, res, next) => {
    try {
        const newPreferences = { ...req.user.preferences, ...req.body };
        await req.user.update({ preferences: newPreferences });

        res.json({
            preferences: newPreferences,
            message: 'Preferences updated successfully'
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/v1/user/stats - Get user statistics
router.get('/stats', async (req, res, next) => {
    try {
        const [bookmarkCount, historyCount] = await Promise.all([
            Bookmark.count({ where: { userId: req.user.id } }),
            ReadingHistory.count({ where: { userId: req.user.id } }),
        ]);

        res.json({
            stats: {
                bookmarks: bookmarkCount,
                articlesRead: historyCount,
                memberSince: req.user.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
