import { Request, Response } from 'express';
import { z } from 'zod';
import * as ecoService from '../services/ecoService';

const promptIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID deve ser um número inteiro positivo'),
});

export const getEcoStats = async (req: Request, res: Response) => {
  const parsed = promptIdSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'ID inválido',
      errors: parsed.error.issues.map(i => i.message),
    });
  }

  try {
    const stats = await ecoService.getEcoStats(Number(parsed.data.id));
    res.json(stats);
  } catch (error: any) {
    if (error.message === 'Prompt não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao calcular estatísticas ecológicas' });
  }
};