import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';

export const findCommentById = async (commentId: number) => {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
            user: { select: { id: true, username: true } },
            prompt: { select: { id: true, title: true } }
        }
    });

    if (!comment) {
        logger.warn(`Comentário não encontrado: id=${commentId}`);
        throw new Error('Comment not found');
    }

    return comment;
};

export const deleteComment = async (commentId: number) => {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
        logger.warn(`Comentário não encontrado ao apagar: id=${commentId}`);
        throw new Error('Comment not found');
    }

    const deleted = await prisma.comment.delete({ where: { id: commentId } });
    logger.info(`Comentário apagado: id=${commentId}`);
    return deleted;
};

export const getCommentsByPromptId = async (id: number) => {
    const promptExists = await prisma.prompt.findUnique({ where: { id } });

    if (!promptExists) {
        logger.warn(`Prompt não encontrado ao buscar comentários: id=${id}`);
        throw new Error('Prompt not found');
    }

    return await prisma.comment.findMany({
        where: { promptId: id },
        include: { user: { select: { id: true, username: true } } },
        orderBy: { createdAt: 'desc' }
    });
};

export const createComment = async (promptId: number, userId: number, comment: string) => {
    const promptExists = await prisma.prompt.findUnique({ where: { id: promptId } });
    if (!promptExists) {
        logger.warn(`Prompt não encontrado ao criar comentário: id=${promptId}`);
        throw new Error('Prompt not found');
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        logger.warn(`Utilizador não encontrado ao criar comentário: id=${userId}`);
        throw new Error('User not found');
    }

    const newComment = await prisma.comment.create({
        data: { comment, promptId, userId },
        include: { user: { select: { id: true, username: true } } }
    });

    logger.info(`Comentário criado: id=${newComment.id} no prompt=${promptId} por user=${userId}`);
    return newComment;
};
