import { Router } from 'express';
import { generate, refresh, feedback } from '../controllers/excuse.controller';
import { generateLimiter } from '../middlewares/rateLimiter';

const router = Router();
router.post('/generate', generateLimiter, generate);
router.post('/refresh', generateLimiter, refresh);
router.post('/feedback', feedback);

export default router;
