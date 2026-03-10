import { Router } from 'express';
import { getPresets } from '../controllers/preset.controller';

const router = Router();
router.get('/', getPresets);

export default router;
