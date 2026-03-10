import { Router } from 'express';
import { getHistory, deleteHistory } from '../controllers/history.controller';

const router = Router();
router.get('/', getHistory);
router.delete('/:id', deleteHistory);

export default router;
