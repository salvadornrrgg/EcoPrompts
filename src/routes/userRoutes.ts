import { Router } from 'express';
import { getUsers, createUserController, getFavAuthors } from '../controllers/userController.js';
const router = Router();
router.get('/', getUsers);
router.post('/', createUserController);
router.get('/:id/authors', getFavAuthors)
export default router;