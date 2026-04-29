import { Request, Response } from 'express';
import * as ratingService from '../services/ratingService'
import { ratingBodySchema, ratingIdParamSchema } from '../schemas/ratingSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';

export const createRatingPromptController = async (req: Request, res: Response) => {
    const idResult = ratingIdParamSchema.safeParse({id: req.params.id});
    if (!idResult.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: idResult.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    const dataResult = ratingBodySchema.safeParse(req.body);
    if (!dataResult.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: dataResult.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
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
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao criar avaliação" });
    }
};

export const updateRatingPromptController = async (req: Request, res: Response) => {
    const idResult = ratingIdParamSchema.safeParse({id: req.params.id});
    if (!idResult.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: idResult.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    const dataResult = ratingBodySchema.safeParse(req.body);
    if (!dataResult.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: dataResult.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const promptId = parseInt(idResult.data.id);
        const userId = (req as AuthenticatedRequest).user!.id;
        const { score } = dataResult.data;
        const updatedRating = await ratingService.updateRating(promptId, userId, score);
        res.status(200).json(updatedRating);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao atualizar Avaliação" });
    }
};

export const deleteRatingPromptController = async (req: Request, res: Response) => {
    const result = ratingIdParamSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const promptId = parseInt(result.data.id);
        const userId = (req as AuthenticatedRequest).user!.id;
        await ratingService.deleteRating(promptId, userId);
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao remover avaliação" });
    }
};

export const adminDeleteRatingController = async (req: Request, res: Response) => {
    const result = ratingIdParamSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const ratingId = parseInt(result.data.id);
        await ratingService.adminDeleteRating(ratingId);
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao remover avaliação como admin" });
    }
};