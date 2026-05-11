import { z } from 'zod';

export const translateSchema = z.object({
    text: z.string().min(1, 'Texto é obrigatório').max(5000, 'Texto não pode exceder 5000 caracteres'),
    source: z.string().min(2).max(10).default('auto'),
    target: z.string().min(2).max(10),
});
