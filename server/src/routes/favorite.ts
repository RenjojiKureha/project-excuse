import { Router } from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favorite.controller';

const router = Router();
router.post('/', addFavorite);
router.delete('/:id', removeFavorite);
router.get('/', getFavorites);

export default router;
