import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/commentService';
import { commentIdSchema, createCommentBodySchema, promptIdParamSchema } from '../schemas/commentSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';

export const getCommentController = async (req: Request, res: Response, next: NextFunction) => {
    const result = commentIdSchema.safeParse({ commentId: req.params.commentId });
    if (!result.success) {
        const err: any = new Error('commentID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const comment = await commentService.findCommentById(parseInt(result.data.commentId));
        res.json(comment);
    } catch (error: any) {
        if (error.message === 'Comment not found') error.status = 404;
        next(error);
    }
};

export const deleteCommentController = async (req: Request, res: Response, next: NextFunction) => {
    const result = commentIdSchema.safeParse({ commentId: req.params.commentId });
    if (!result.success) {
        const err: any = new Error('commentID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const commentId = parseInt(result.data.commentId);
        const comment = await commentService.findCommentById(commentId);
        if (!comment) return res.status(404).json({ error: "Comentário não encontrado" });

        const currentUser = (req as AuthenticatedRequest).user;
        if (!currentUser) return res.status(401).json({ error: "Não autenticado" });

        if (comment.userId !== currentUser.id) {
            return res.status(403).json({ error: "Não pode apagar comentário de outro utilizador" });
        }

        await commentService.deleteComment(commentId);
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
};

export const getCommentsByPromptController = async (req: Request, res: Response, next: NextFunction) => {
    const result = promptIdParamSchema.safeParse({ promptId: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID de prompt inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const comments = await commentService.getCommentsByPromptId(parseInt(result.data.promptId));
        res.json(comments);
    } catch (error: any) {
        if (error.message === 'Prompt not found') error.status = 404;
        next(error);
    }
};

export const createCommentsController = async (req: Request, res: Response, next: NextFunction) => {
    const idResult = promptIdParamSchema.safeParse({ promptId: req.params.id });
    if (!idResult.success) {
        const err: any = new Error('ID de prompt inválido');
        err.status = 400;
        err.zodErrors = idResult.error.issues;
        return next(err);
    }

    const dataResult = createCommentBodySchema.safeParse(req.body);
    if (!dataResult.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = dataResult.error.issues;
        return next(err);
    }

    try {
        const promptId = parseInt(idResult.data.promptId);
        const { comment } = dataResult.data;
        const userId = (req as AuthenticatedRequest).user!.id;
        const newComment = await commentService.createComment(promptId, userId, comment);
        res.status(201).json(newComment);
    } catch (error: any) {
        next(error);
    }
};
