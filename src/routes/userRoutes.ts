import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard';
import { requireUserType } from '../middlewares/roleGuard';
import {
    getUsersController,
    createUserController,
    getUserController,
    updateUserController,
    deleteUserController
} from '../controllers/userController';

const router = Router();

// Públicas
router.post('/', createUserController);      // registo (criação de conta)
router.get('/:id', getUserController);       // perfil público (controller esconde email/password se não for dono ou admin)

// Protegidas com autenticação
router.put('/:id', authGuard, updateUserController);   // dentro do controller verifica se é dono ou admin
router.delete('/:id', authGuard, deleteUserController); // dentro verifica se é dono ou admin

// Apenas administradores podem listar todos os utilizadores
router.get('/', authGuard, requireUserType(['Admin']), getUsersController);

export default router;