import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard';
import { requireUserType } from '../middlewares/roleGuard';
import { 
    adminDeleteRatingController
} from '../controllers/ratingController';

const router = Router();

// Apenas Admin pode apagar qualquer avaliação
router.delete('/:id', authGuard, requireUserType(['Admin']), adminDeleteRatingController);

export default router;