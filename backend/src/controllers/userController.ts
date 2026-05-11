import { type Request, type Response } from 'express';
import * as userService from '../services/userService';
import { createUserSchema, userIdSchema, updateUserSchema } from '../schemas/userSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';

export const getUsersController = async (req: Request, res: Response) => {
    const users = await userService.findAllUsers();
    const safeUsers = users.map((user: any) => {
        const { password, ...rest } = user;
        return rest;
    });
    res.json(safeUsers);
};

export const createUserController = async (req: Request, res: Response) => {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }
    try {
        const newUser = await userService.createUser(
            result.data.username,
            result.data.email,
            result.data.password,
            result.data.userType
        );
        const { password, ...safeUser } = newUser;
        res.status(201).json(safeUser);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Error" });
    }
};

export const getUserController = async (req: Request, res: Response) => {
    const result = userIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const user = await userService.findUser(parseInt(result.data.id));
        if (!user) return res.status(404).json({ error: "User not found" });

        // Verifica se há utilizador autenticado
        const currentUser = (req as AuthenticatedRequest).user;
        
        // Só mostra email se:
        // 1. Está autenticado E é o próprio utilizador OU é admin
        // 2. Caso contrário, mostra o user sem email
        const isOwnerOrAdmin = currentUser && (currentUser.id === user.id || currentUser.userType === 'Admin');

        const { password, email, ...safeUser } = user;
        
        const responseUser = isOwnerOrAdmin 
            ? { ...safeUser, email: user.email }
            : safeUser;
            
        res.status(200).json(responseUser);
    } catch (error) {
        res.status(404).json({ error: "Invalid User ID" });
    }
};

export const updateUserController = async (req: Request, res: Response) => {
    const idResult = userIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: idResult.error.issues.map((issue) => issue.message)
        });
    }

    const dataResult = updateUserSchema.safeParse(req.body);
    if (!dataResult.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: dataResult.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const userId = parseInt(idResult.data.id);
        const currentUser = (req as AuthenticatedRequest).user;
        if (!currentUser) return res.status(401).json({ error: "Não autenticado" });

        if (currentUser.id !== userId && currentUser.userType !== 'Admin') {
            return res.status(403).json({ error: "Acesso negado a este perfil" });
        }

        const updatedUser = await userService.updateUser(userId, dataResult.data);
        const { password, ...safeUser } = updatedUser;
        res.status(200).json(safeUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Erro ao atualizar utilizador" });
    }
};

export const deleteUserController = async (req: Request, res: Response) => {
    const result = userIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const userId = parseInt(result.data.id);
        const currentUser = (req as AuthenticatedRequest).user;
        if (!currentUser) return res.status(401).json({ error: "Não autenticado" });

        if (currentUser.id !== userId && currentUser.userType !== 'Admin') {
            return res.status(403).json({ error: "Acesso negado" });
        }

        await userService.deleteUser(userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Erro ao remover utilizador" });
    }
};