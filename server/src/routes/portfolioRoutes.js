import { Router } from 'express';
import { listPortfolio, getPortfolioItem, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '../controllers/portfolioController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listPortfolio);
router.get('/:id', getPortfolioItem);
router.post('/', requireAuth, requireAdmin, createPortfolioItem);
router.put('/:id', requireAuth, requireAdmin, updatePortfolioItem);
router.delete('/:id', requireAuth, requireAdmin, deletePortfolioItem);

export default router;
