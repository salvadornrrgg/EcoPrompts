import { z } from 'zod';

export const createUserSchema = z.object({
    username: z.string()
        .min(3, 'Username deve ter pelo menos 3 caracteres')
        .max(30, 'Username deve ter no máximo 30 caracteres'),
    email: z.string()
        .email('Email inválido'),
    password: z.string()
        .min(6, 'Password deve ter pelo menos 6 caracteres'),
    userType: z.enum(['User', 'Mod', 'Admin'])
        .default('User')  // valor padrão se não for enviado
});

export const updateUserSchema = z.object({
    username: z.string()
        .min(3, 'Username deve ter pelo menos 3 caracteres')
        .max(30, 'Username deve ter no máximo 30 caracteres')
        .optional(),
    email: z.string()
        .email('Email inválido')
        .optional(),
    password: z.string()
        .min(6, 'Password deve ter pelo menos 6 caracteres')
        .optional(),
    userType: z.enum(['User', 'Mod', 'Admin'])
        .optional()
});

export const userIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID deve ser um número inteiro positivo')
});