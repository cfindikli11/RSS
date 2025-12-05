import express from 'express';
import { body } from 'express-validator';
import { Feed } from '../../../models/index.js';
import { auth, requireAdmin } from '../../../middleware/auth.js';
import { validate } from '../../../middleware/validate.js';

const router = express.Router();

// GET /api/v1/feeds - Get all feeds (admin sees all, users see active default feeds)
router.get('/', async (req, res, next) => {
    try {
        const where = {};

        // Non-admins only see default active feeds
        if (!req.user || req.user.role !== 'admin') {
            where.isDefault = true;
            where.isActive = true;
        }

        const feeds = await Feed.findAll({
            where,
            order: [['name', 'ASC']],
        });

        res.json({ feeds });
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/feeds - Add new feed (admin only)
router.post('/',
    auth,
    requireAdmin,
    [
        body('name').trim().notEmpty(),
        body('url').isURL(),
        body('category').trim().notEmpty(),
        body('language').isIn(['tr', 'en']).optional(),
    ],
    validate,
    async (req, res, next) => {
        try {
            const { name, url, category, language = 'tr', isDefault = false } = req.body;

            const feed = await Feed.create({
                name,
                url,
                category,
                language,
                isDefault,
            });

            res.status(201).json({ feed, message: 'Feed created successfully' });
        } catch (error) {
            next(error);
        }
    }
);

// PUT /api/v1/feeds/:id - Update feed (admin only)
router.put('/:id', auth, requireAdmin, async (req, res, next) => {
    try {
        const feed = await Feed.findByPk(req.params.id);

        if (!feed) {
            return res.status(404).json({ error: 'Feed not found' });
        }

        await feed.update(req.body);
        res.json({ feed, message: 'Feed updated successfully' });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/v1/feeds/:id - Delete feed (admin only)
router.delete('/:id', auth, requireAdmin, async (req, res, next) => {
    try {
        const feed = await Feed.findByPk(req.params.id);

        if (!feed) {
            return res.status(404).json({ error: 'Feed not found' });
        }

        await feed.destroy();
        res.json({ message: 'Feed deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
