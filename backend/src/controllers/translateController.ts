import { Request, Response } from 'express';
import { translateSchema } from '../schemas/translateSchema';
import * as translateService from '../services/translateService';

export const translateController = async (req: Request, res: Response) => {
    const result = translateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: 'Dados inválidos',
            errors: result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }

    try {
        const { text, source, target } = result.data;
        const translatedText = await translateService.translateText(text, source, target);
        res.json({ translatedText });
    } catch (error: any) {
        console.error(error);
        res.status(502).json({ error: error.message || 'Erro ao traduzir texto' });
    }
};
