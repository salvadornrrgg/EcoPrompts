import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as ecoService from '../services/ecoService';

const promptIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID deve ser um número inteiro positivo'),
});

export const getEcoStats = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = promptIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const err: any = new Error('ID inválido');
    err.status = 400;
    err.zodErrors = parsed.error.issues;
    return next(err);
  }

  try {
    const stats = await ecoService.getEcoStats(Number(parsed.data.id));
    res.json(stats);
  } catch (error: any) {
    if (error.message === 'Prompt não encontrado') error.status = 404;
    next(error);
  }
};
