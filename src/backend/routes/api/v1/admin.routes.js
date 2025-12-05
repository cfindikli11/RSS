import express from 'express';
import { Op } from 'sequelize';
import { User, Feed, Article } from '../../../models/index.js';
import { auth, requireAdmin } from '../../../middleware/auth.js';
import { fetchAllFeeds } from '../../../services/rssService.js';

const router = express.Router();

// All routes require admin authentication
router.use(auth, requireAdmin);

// GET /api/v1/admin/users - Get all users
router.get('/users', async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']],
        });

        res.json({ users });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/v1/admin/users/:id - Delete user
router.delete('/users/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent self-deletion
        if (user.id === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/admin/feeds/refresh - Trigger manual feed refresh
router.post('/feeds/refresh', async (req, res, next) => {
    try {
        const result = await fetchAllFeeds();
        res.json({
            message: 'Feeds refreshed successfully',
            result
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/v1/admin/stats - Get platform statistics
router.get('/stats', async (req, res, next) => {
    try {
        const [userCount, feedCount, articleCount, activeFeeds] = await Promise.all([
            User.count(),
            Feed.count(),
            Article.count(),
            Feed.count({ where: { isActive: true } }),
        ]);

        // Get recent articles count (last 24 hours)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentArticles = await Article.count({
            where: { createdAt: { [Op.gte]: yesterday } },
        });

        res.json({
            stats: {
                users: userCount,
                feeds: feedCount,
                activeFeeds,
                totalArticles: articleCount,
                recentArticles,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
