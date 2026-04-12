import { z } from 'zod';

// Schema para criar categoria
export const createCategorySchema = z.object({
    name: z.string()
        .min(1, 'O nome da categoria é obrigatório')
        .min(3, 'O nome da categoria deve ter pelo menos 3 caracteres')
        .max(50, 'O nome da categoria deve ter no máximo 50 caracteres')
        .trim()
});

// Schema para ID (número inteiro positivo)
export const categoryIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID deve ser um número inteiro positivo')
});

// Schema para search query
export const categorySearchSchema = z.object({
    q: z.string()
        .min(1, 'Termo de pesquisa é obrigatório')
        .trim()
});