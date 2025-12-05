import express from 'express';
import { Bookmark, Article } from '../../../models/index.js';
import { auth } from '../../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/v1/bookmarks - Get user's bookmarks
router.get('/', async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Article,
                as: 'article',
            }],
            order: [['createdAt', 'DESC']],
        });

        res.json({ bookmarks });
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/bookmarks - Add bookmark
router.post('/', async (req, res, next) => {
    try {
        const { articleId, tags = [], notes = '', collection = 'default' } = req.body;

        // Check if article exists
        const article = await Article.findByPk(articleId);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        // Check if already bookmarked
        const existing = await Bookmark.findOne({
            where: { userId: req.user.id, articleId },
        });

        if (existing) {
            return res.status(409).json({ error: 'Article already bookmarked' });
        }

        // Create bookmark
        const bookmark = await Bookmark.create({
            userId: req.user.id,
            articleId,
            tags,
            notes,
            collection,
        });

        res.status(201).json({ bookmark, message: 'Bookmark added successfully' });
    } catch (error) {
        next(error);
    }
});

// PUT /api/v1/bookmarks/:id - Update bookmark
router.put('/:id', async (req, res, next) => {
    try {
        const bookmark = await Bookmark.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        await bookmark.update(req.body);
        res.json({ bookmark, message: 'Bookmark updated successfully' });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/v1/bookmarks/:id - Remove bookmark
router.delete('/:id', async (req, res, next) => {
    try {
        const bookmark = await Bookmark.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        await bookmark.destroy();
        res.json({ message: 'Bookmark removed successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
