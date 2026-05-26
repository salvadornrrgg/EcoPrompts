import { Request, Response, NextFunction } from 'express';
import * as ratingService from '../services/ratingService';
import { ratingBodySchema, ratingIdParamSchema } from '../schemas/ratingSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';

export const createRatingPromptController = async (req: Request, res: Response, next: NextFunction) => {
    const idResult = ratingIdParamSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = idResult.error.issues;
        return next(err);
    }

    const dataResult = ratingBodySchema.safeParse(req.body);
    if (!dataResult.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = dataResult.error.issues;
        return next(err);
    }

    try {
        const userId = (req as AuthenticatedRequest).user!.id;
        const newRating = await ratingService.createRating({
            score: dataResult.data.score,
            userId,
            promptId: parseInt(idResult.data.id)
        });
        res.status(201).json(newRating);
    } catch (error: any) {
        next(error);
    }
};

export const updateRatingPromptController = async (req: Request, res: Response, next: NextFunction) => {
    const idResult = ratingIdParamSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = idResult.error.issues;
        return next(err);
    }

    const dataResult = ratingBodySchema.safeParse(req.body);
    if (!dataResult.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = dataResult.error.issues;
        return next(err);
    }

    try {
        const promptId = parseInt(idResult.data.id);
        const userId = (req as AuthenticatedRequest).user!.id;
        const updatedRating = await ratingService.updateRating(promptId, userId, dataResult.data.score);
        res.status(200).json(updatedRating);
    } catch (error: any) {
        next(error);
    }
};

export const deleteRatingPromptController = async (req: Request, res: Response, next: NextFunction) => {
    const result = ratingIdParamSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const promptId = parseInt(result.data.id);
        const userId = (req as AuthenticatedRequest).user!.id;
        await ratingService.deleteRating(promptId, userId);
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
};

export const adminDeleteRatingController = async (req: Request, res: Response, next: NextFunction) => {
    const result = ratingIdParamSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const ratingId = parseInt(result.data.id);
        await ratingService.adminDeleteRating(ratingId);
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
};
