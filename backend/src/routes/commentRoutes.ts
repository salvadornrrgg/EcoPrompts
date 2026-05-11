import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard';
import {
    getCommentController,
    deleteCommentController
} from '../controllers/commentController';

const router = Router();

// Pública – qualquer pessoa pode ver um comentário específico
router.get('/:commentId', getCommentController);

// Protegida – apenas o autor do comentário ou moderador/admin podem apagar
router.delete('/:commentId', authGuard, deleteCommentController);

export default router;