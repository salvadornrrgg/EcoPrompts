import { Request, Response, NextFunction } from 'express';
import { translateSchema } from '../schemas/translateSchema';
import * as translateService from '../services/translateService';

export const translateController = async (req: Request, res: Response, next: NextFunction) => {
    const result = translateSchema.safeParse(req.body);
    if (!result.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const { text, source, target } = result.data;
        const translatedText = await translateService.translateText(text, source, target);
        res.json({ translatedText });
    } catch (error: any) {
        error.status = 502;
        next(error);
    }
};
