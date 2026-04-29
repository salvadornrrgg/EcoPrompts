import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { loginSchema } from '../schemas/authSchema';

export const loginController = async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);

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
        const { email, password } = result.data;
        const authResult = await authService.login(email, password);
        res.status(200).json(authResult);
    } catch (error: any) {
        console.error(error);
        res.status(401).json({ error: error.message || "Erro ao fazer login" });
    }
};