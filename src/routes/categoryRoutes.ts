import { Router } from 'express';
import { getAuthors, createAuthorController, getAuthorById } from '../controllers/authorController.js';
const router = Router();
router.get('/', getAuthors);
router.post('/', createAuthorController);
router.get('/:id', getAuthorById);
export default router;