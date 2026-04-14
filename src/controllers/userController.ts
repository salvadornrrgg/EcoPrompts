import { type Request, type Response } from 'express';
import * as userService from '../services/userService.ts';
import { createUserSchema, userIdSchema, updateUserSchema } from '../schemas/userSchema.js';


// GET /users - Devolve utilizadores
export const getUsersController = async (req: Request, res: Response) => {
    const users = await userService.findAllUsers();
    res.json(users);
};


// POST /users - Cria utilizador
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
        res.status(201).json(newUser);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Error" });
    }
};

// GET /users/:id - Devolve utilizador
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
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: "Invalid User ID" });
    }
};

// PUT /users/:id - Atualizar utilizador
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
        const updatedUser = await userService.updateUser(parseInt(idResult.data.id), dataResult.data);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Erro ao atualizar utilizador" });
    }
};

// DELETE /users/:id - Remover utilizador
export const deleteUserController = async (req: Request, res: Response) => {
    const result = userIdSchema.safeParse({ id: req.params.id });

    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        await userService.deleteUser(parseInt(result.data.id));
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Erro ao remover utilizador" });
    }
};