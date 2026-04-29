import { Request, Response } from 'express';
import * as commentService from '../services/commentService';
import { commentIdSchema, createCommentBodySchema, promptIdParamSchema } from '../schemas/commentSchema';


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
            await commentService.deleteComment(parseInt(result.data.commentId));
            res.status(204).send();
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ error: error.message || "Erro ao remover comentário" });
        }
};


// GET /prompts/:id/comments - Lista comentarios de um prompt
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

// POST /prompts/:id/comments - Adicionar comentario a um prompt
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
        const { comment, userId } = dataResult.data;

        const newComment = await commentService.createComment(promptId, userId, comment);
        
        res.status(201).json(newComment); 
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao adicionar comentário" });
    }
};