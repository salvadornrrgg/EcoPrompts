import { Router } from 'express';
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

// Rotas de prompts
router.get('/', getPromptsController);
router.get('/:id', getPromptController);
router.post('/', createPromptController);
router.put('/:id', updatePromptController);
router.delete('/:id', deletePromptController);

// Rotas aninhadas de versões
router.get('/:id/versions', getVersionsByPromptController);
router.post('/:id/versions', createVersionController);

// Rotas aninhadas de comentários
router.get('/:id/comments', getCommentsByPromptController);
router.post('/:id/comments', createCommentsController);

// Rotas aninhadas de avaliações
router.post('/:id/rating', createRatingPromptController);
router.put('/:id/rating', updateRatingPromptController);
router.delete('/:id/rating', deleteRatingPromptController);
export default router;