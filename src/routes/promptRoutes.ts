import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard';

import {
    getPromptsController,
    getPromptController,
    createPromptController,
    updatePromptController,
    deletePromptController,
    getVersionsByPromptController,
    createVersionController
} from '../controllers/promptController';

import { 
    getCommentsByPromptController, 
    createCommentsController 
} from '../controllers/commentController';

import { 
    createRatingPromptController, 
    updateRatingPromptController,
    deleteRatingPromptController 
} from '../controllers/ratingController';

const router = Router();

// Rotas de prompts (públicas: GET; protegidas: POST, PUT, DELETE)
router.get('/', getPromptsController);
router.get('/:id', getPromptController);
router.post('/', authGuard, createPromptController);
router.put('/:id', authGuard, updatePromptController);
router.delete('/:id', authGuard, deletePromptController);

// Rotas aninhadas de versões (GET público; POST protegido)
router.get('/:id/versions', getVersionsByPromptController);
router.post('/:id/versions', authGuard, createVersionController);

// Rotas aninhadas de comentários (GET público; POST protegido)
router.get('/:id/comments', getCommentsByPromptController);
router.post('/:id/comments', authGuard, createCommentsController);

// Rotas aninhadas de avaliações (todas protegidas)
router.post('/:id/rating', authGuard, createRatingPromptController);
router.put('/:id/rating', authGuard, updateRatingPromptController);
router.delete('/:id/rating', authGuard, deleteRatingPromptController);

export default router;