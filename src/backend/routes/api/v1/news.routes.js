import express from 'express';
import { Op } from 'sequelize';
import { Article, Feed } from '../../../models/index.js';
import { optionalAuth } from '../../../middleware/auth.js';
import { searchLimiter } from '../../../middleware/rateLimit.js';

const router = express.Router();

// GET /api/v1/news - Get paginated news
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            search,
            source,
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const where = {};

        // Filters
        if (category && category !== 'Tümü') {
            where.category = category;
        }

        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { summary: { [Op.like]: `%${search}%` } },
            ];
        }

        if (source) {
            where.source = source;
        }

        // Fetch articles
        const { count, rows: articles } = await Article.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset,
            order: [['publishedAt', 'DESC']],
            include: [{
                model: Feed,
                as: 'feed',
                attributes: ['name', 'category', 'language'],
            }],
        });

        res.json({
            articles,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/v1/news/:id - Get single article
router.get('/:id', optionalAuth, async (req, res, next) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [{
                model: Feed,
                as: 'feed',
            }],
        });

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        // Increment view count
        await article.increment('viewCount');

        res.json(article);
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/news/search - Advanced search
router.post('/search', searchLimiter, optionalAuth, async (req, res, next) => {
    try {
        const { query, filters = {} } = req.body;
        const { category, sentiment, dateFrom, dateTo } = filters;

        const where = {};

        if (query) {
            where[Op.or] = [
                { title: { [Op.like]: `%${query}%` } },
                { summary: { [Op.like]: `%${query}%` } },
                { content: { [Op.like]: `%${query}%` } },
            ];
        }

        if (category) where.category = category;
        if (sentiment) where.sentiment = sentiment;

        if (dateFrom || dateTo) {
            where.publishedAt = {};
            if (dateFrom) where.publishedAt[Op.gte] = new Date(dateFrom);
            if (dateTo) where.publishedAt[Op.lte] = new Date(dateTo);
        }

        const articles = await Article.findAll({
            where,
            limit: 50,
            order: [['publishedAt', 'DESC']],
        });

        res.json({ articles, count: articles.length });
    } catch (error) {
        next(error);
    }
});

export default router;
