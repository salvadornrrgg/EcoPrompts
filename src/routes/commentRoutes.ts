import { Router } from 'express';
import {
    getCommentController,
    deleteCommentController
} from '../controllers/commentController';

const router = Router();

// Rotas de comentários

router.get('/:commentId', getCommentController);
router.delete('/:commentId', deleteCommentController);


export default router;