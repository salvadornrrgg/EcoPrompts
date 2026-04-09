import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';

const router = Router();


// Lista todas as categorias ordenadas 
router.get('/', categoryController.getAllCategories);

// Pesquisa categorias por nome via query string (?q=...) [cite: 200]
router.get('/search', categoryController.searchCategories);

// Obtém uma categoria específica e os seus prompts [cite: 195, 258]
router.get('/:id', categoryController.getCategoryById);


// router.post('/', verifyToken, isAdmin, categoryController.createCategoryController);
router.post('/', categoryController.createCategoryController);

export default router;