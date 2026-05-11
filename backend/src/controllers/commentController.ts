import { Request, Response } from 'express';
import * as commentService from '../services/commentService';
import { commentIdSchema, createCommentBodySchema, promptIdParamSchema } from '../schemas/commentSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';

export const getCommentController = async (req: Request, res: Response) => {
    const result = commentIdSchema.safeParse({ commentId: req.params.commentId });
    if (!result.success) {
        return res.status(400).json({
            error: "commentID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }
    try {
        const comment = await commentService.findCommentById(parseInt(result.data.commentId));
        res.json(comment);
    } catch (error: any) {
        console.error(error);
        res.status(404).json({ error: error.message || "Erro ao buscar comentário" });
    }
};

export const deleteCommentController = async (req: Request, res: Response) => {
    const result = commentIdSchema.safeParse({ commentId: req.params.commentId });
    if (!result.success) {
        return res.status(400).json({
            error: "commentID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const commentId = parseInt(result.data.commentId);
        const comment = await commentService.findCommentById(commentId);
        if (!comment) return res.status(404).json({ error: "Comentário não encontrado" });

        const currentUser = (req as AuthenticatedRequest).user;
        if (!currentUser) return res.status(401).json({ error: "Não autenticado" });

        // Apenas o próprio dono pode apagar (Mod/Admin também permitidos via middleware na rota)
        if (comment.userId !== currentUser.id) {
            return res.status(403).json({ error: "Não pode apagar comentário de outro utilizador" });
        }

        await commentService.deleteComment(commentId);
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao remover comentário" });
    }
};

export const getCommentsByPromptController = async (req: Request, res: Response) => {
    const result = promptIdParamSchema.safeParse({ promptId: req.params.id });
    if (!result.success) {
        return res.status(400).json({
            error: "ID de prompt inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }
    try {
        const comments = await commentService.getCommentsByPromptId(parseInt(result.data.promptId));
        res.json(comments);
    } catch (error: any) {
        console.error(error);
        res.status(404).json({ error: error.message || "Erro ao buscar comentários" });
    }
};

export const createCommentsController = async (req: Request, res: Response) => {
    const result = promptIdParamSchema.safeParse({ promptId: req.params.id });
    if (!result.success) {
        return res.status(400).json({
            error: "ID de prompt inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    const dataResult = createCommentBodySchema.safeParse(req.body);
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
        const promptId = parseInt(result.data.promptId);
        const { comment } = dataResult.data;
        const userId = (req as AuthenticatedRequest).user!.id;
        const newComment = await commentService.createComment(promptId, userId, comment);
        res.status(201).json(newComment);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao adicionar comentário" });
    }
};