import express from 'express';
import { getMarketData } from '../../../services/marketService.js';

const router = express.Router();

// GET /api/v1/market
router.get('/', async (req, res, next) => {
    try {
        const data = await getMarketData();
        res.json(data);
    } catch (error) {
        next(error);
    }
});

export default router;
