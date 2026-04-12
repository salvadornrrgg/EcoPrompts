import { z } from 'zod';

// Schema para criar prompt
export const createPromptSchema = z.object({
    title: z.string()
        .min(3, 'Título deve ter pelo menos 3 caracteres')
        .max(100, 'Título deve ter no máximo 100 caracteres'),
    description: z.string()
        .min(10, 'Descrição deve ter pelo menos 10 caracteres')
        .max(500, 'Descrição deve ter no máximo 500 caracteres'),
    prompt: z.string()
        .min(5, 'Prompt é obrigatório e deve ter pelo menos 5 caracteres'),
    AImodel: z.string()
        .min(1, 'Modelo de IA é obrigatório'),
    result: z.string()
        .min(1, 'Resultado é obrigatório'),
    categoryId: z.coerce.number()
        .int('categoryId deve ser um número inteiro')
        .positive('categoryId deve ser positivo'),
    originalId: z.coerce.number()
        .int()
        .positive()
        .optional()
        .nullable(),
    versionNumber: z.coerce.number()
        .int()
        .positive()
        .optional()
        .default(1)
});

// Schema para atualizar prompt (todos opcionais)
export const updatePromptSchema = createPromptSchema.partial();

// Schema para ID
export const promptIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID deve ser um número inteiro positivo')
});

// Schema para search query
export const promptSearchSchema = z.object({
    q: z.string()
        .min(1, 'Termo de pesquisa é obrigatório')
        .trim(),
    categoryId: z.coerce.number().int().positive().optional(),
    model: z.string().optional()
});

// Schema para versionNumber
export const versionNumberSchema = z.object({
    versionNumber: z.coerce.number()
        .int()
        .positive('Número da versão deve ser positivo')
});