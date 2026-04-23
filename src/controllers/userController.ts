import { type Request, type Response } from 'express';
import * as userService from '../services/userService.ts';
import { createUserSchema, userIdSchema, updateUserSchema } from '../schemas/userSchema.js';

/**
 * Controlador para operações relacionadas a utilizadores
 * Gerencia todas as operações CRUD para utilizadores
 */


/**
 * GET /users - Devolve todos os utilizadores
 * Endpoint: GET /api/users
 *
 * @param req Objeto Request do Express
 * @param res Objeto Response do Express
 * @returns Lista de todos os utilizadores em formato JSON
 */
export const getUsersController = async (req: Request, res: Response) => {
    const users = await userService.findAllUsers();
    res.json(users);
};


/**
 * POST /users - Cria um novo utilizador
 * Endpoint: POST /api/users
 *
 * Valida os dados de entrada usando Zod schema e cria um novo utilizador no sistema
 *
 * @param req Objeto Request do Express contendo body com dados do utilizador
 * @param res Objeto Response do Express
 * @returns Utilizador criado com status 201 ou erro de validação com status 400
 */
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

/**
 * GET /users/:id - Obtém um utilizador específico pelo ID
 * Endpoint: GET /api/users/:id
 *
 * Valida o parâmetro ID e busca o utilizador correspondente no sistema
 *
 * @param req Objeto Request do Express com parâmetro ID na URL
 * @param res Objeto Response do Express
 * @returns Utilizador encontrado com status 200, erro 400 para ID inválido, ou 404 se não encontrado
 */
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

/**
 * PUT /users/:id - Atualiza informações de um utilizador existente
 * Endpoint: PUT /api/users/:id
 *
 * Valida tanto o ID do parâmetro como os dados do corpo da requisição
 * Permite atualização parcial dos campos do utilizador
 *
 * @param req Objeto Request do Express com ID na URL e dados no body
 * @param res Objeto Response do Express
 * @returns Utilizador atualizado com status 200 ou erros apropriados
 */
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

/**
 * DELETE /users/:id - Remove um utilizador do sistema
 * Endpoint: DELETE /api/users/:id
 *
 * Valida o ID do parâmetro e remove o utilizador correspondente
 * Retorna status 204 (No Content) em caso de sucesso
 *
 * @param req Objeto Request do Express com ID na URL
 * @param res Objeto Response do Express
 * @returns Status 204 em caso de sucesso ou erros apropriados
 */
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