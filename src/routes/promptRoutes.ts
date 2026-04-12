import { Router } from 'express';
import {
    getPromptsController,
    getPromptController,
    createPromptController,
    updatePromptController,
    deletePromptController,
    getVersionsByPromptController,
    createVersionController
} from '../controllers/promptController.js';

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

export default router;