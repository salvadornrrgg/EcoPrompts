import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';

const router = Router();


// Lista todas as categorias ordenadas 
router.get('/', categoryController.getAllCategories);

// Pesquisa categorias por nome via query string (?q=...)
router.get('/search', categoryController.searchCategories);

// Lista prompts pertencentes a uma determinada categoria
router.get('/:id/prompts', categoryController.getPromptsByCategoryId);

// Obtém uma categoria específica e os seus prompts
router.get('/:id', categoryController.getCategoryById);


// router.post('/', verifyToken, isAdmin, categoryController.createCategoryController);
router.post('/', categoryController.createCategoryController);

export default router;