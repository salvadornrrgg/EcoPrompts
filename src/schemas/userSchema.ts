import { z } from 'zod';

export const createUserSchema = z.object({
    username: z.string()
        .min(3, 'Username deve ter pelo menos 3 caracteres')
        .max(30, 'Username deve ter no máximo 30 caracteres'),
    email: z.string()
        .email('Email inválido'),
    password: z.string()
        .min(6, 'Password deve ter pelo menos 6 caracteres'),
    userType: z.coerce.number()
        .int('Tipo de utilizador deve ser um número inteiro')
        .min(0, 'Tipo de utilizador deve ser 0, 1 ou 2')
        .max(2, 'Tipo de utilizador deve ser 0, 1 ou 2')
        .default(0)
});

export const userIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID deve ser um número inteiro positivo')
});

export const updateUserSchema = createUserSchema.partial();