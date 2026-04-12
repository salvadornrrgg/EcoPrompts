import { z } from 'zod';

// Schema para criar versão
export const createVersionSchema = z.object({
    promptText: z.string()
        .min(5, 'Texto do prompt deve ter pelo menos 5 caracteres'),
    improvements: z.string()
        .max(500, 'Descrição de melhorias deve ter no máximo 500 caracteres')
        .optional(),
    rating: z.coerce.number()
        .min(0)
        .max(5)
        .optional()
        .default(0)
});

// Schema para ID da versão
export const versionIdSchema = z.object({
    versionId: z.string().regex(/^\d+$/, 'ID da versão deve ser um número inteiro positivo')
});