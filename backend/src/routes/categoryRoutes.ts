import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard';
import { requireUserType } from '../middlewares/roleGuard';
import * as categoryController from '../controllers/categoryController';

const router = Router();

// Rotas públicas
router.get('/', categoryController.getAllCategories);
router.get('/search', categoryController.searchCategories);
router.get('/:id/prompts', categoryController.getPromptsByCategoryId);
router.get('/:id', categoryController.getCategoryById);

// Apenas Admin pode criar categorias
router.post('/', authGuard, requireUserType(['Admin']), categoryController.createCategoryController);

export default router;