import { z } from 'zod';

export const commentIdSchema = z.object({
    commentId: z.string().regex(/^\d+$/, 'ID do comentário deve ser um número inteiro positivo')
});

export const createCommentBodySchema = z.object({
    comment: z.string().min(1, "O comentário não pode estar vazio"),
    userId: z.number({ required_error: "O ID do utilizador é obrigatório" }) 
});

export const promptIdParamSchema = z.object({
    promptId: z.string().regex(/^\d+$/, 'ID do prompt deve ser um número inteiro')
});