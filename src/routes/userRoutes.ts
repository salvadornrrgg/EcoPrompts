import { Router } from 'express';
import { getUsers, createUserController, getUser } from '../controllers/userController.ts';
const router = Router();
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUserController);
export default router;