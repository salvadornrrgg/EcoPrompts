import { type Request, type Response, type NextFunction } from 'express';
import * as userService from '../services/userService';
import { createUserSchema, userIdSchema, updateUserSchema } from '../schemas/userSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.findAllUsers();
        const safeUsers = users.map((user: any) => {
            const { password, ...rest } = user;
            return rest;
        });
        res.json(safeUsers);
    } catch (error: any) {
        next(error);
    }
};

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
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
        error.status = 400;
        next(error);
    }
};

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
    const result = userIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const user = await userService.findUser(parseInt(result.data.id));
        if (!user) return res.status(404).json({ error: "User not found" });

        const currentUser = (req as AuthenticatedRequest).user;
        const isOwnerOrAdmin = currentUser && (currentUser.id === user.id || currentUser.userType === 'Admin');

        const { password, email, ...safeUser } = user;
        const responseUser = isOwnerOrAdmin ? { ...safeUser, email: user.email } : safeUser;

        res.status(200).json(responseUser);
    } catch (error: any) {
        error.status = 404;
        next(error);
    }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    const idResult = userIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = idResult.error.issues;
        return next(err);
    }

    const dataResult = updateUserSchema.safeParse(req.body);
    if (!dataResult.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = dataResult.error.issues;
        return next(err);
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
        next(error);
    }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    const result = userIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
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
        next(error);
    }
};
