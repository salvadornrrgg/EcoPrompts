import { z } from 'zod';

export const ratingBodySchema = z.object({
    score: z.number().min(1, "A nota mínima é 1").max(5, "A nota máxima é 5"),
    userId: z.number({ required_error: "O ID do utilizador é obrigatório" }) // Temporário até à autenticação
});

export const ratingIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID da avaliação deve ser um número')
});