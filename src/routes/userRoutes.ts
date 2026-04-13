import { Router } from 'express';
import { getUsersController, createUserController, getUserController, updateUserController, deleteUserController } from '../controllers/userController.ts';

const router = Router();
router.get('/', getUsersController);
router.get('/:id', getUserController);

router.post('/', createUserController);//subs

router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;