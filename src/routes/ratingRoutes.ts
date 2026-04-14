import { Router } from 'express';
import { 
    adminDeleteRatingController
} from '../controllers/ratingController.js';

const router = Router();

router.delete('/:id', adminDeleteRatingController);

export default router;