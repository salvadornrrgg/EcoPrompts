import { prisma } from '../lib/prisma.js';

//Obtém um comentário específico
export const findCommentById = async (commentId: number) => {
    const commentExists = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
            user: {
                select: { id: true, username: true } // Traz o nome de quem comentou
            },
            prompt: {
                select: { id: true, title: true } // Traz o título do prompt onde foi feito
            }
        }
    });

    if (!commentExists) {
        throw new Error('Comment not found');
    }

    return commentExists
};


// Remover um comentário
export const deleteComment = async (commentId: number) => {
    const commentExists = await prisma.comment.findUnique({
        where: { id: commentId }
    });

    if (!commentExists) {
        throw new Error('comment not found');
    }

    return await prisma.comment.delete({
        where: { id:commentId }
    });
};

// Lista comentários de um prompt
export const getCommentsByPromptId = async (id: number) => {
    const promptExists = await prisma.prompt.findUnique({
        where: { id }
    });

    if (!promptExists) {
        throw new Error('Prompt not found');
    }

    return await prisma.comment.findMany({
        where: { promptId: id },
        include: {
            user: {
                select: { id: true, username: true } 
            }
        },
        orderBy: {
            createdAt: 'desc' 
        }
    });
};

// Adiciona comentário a um prompt
export const createComment = async (promptId: number, userId: number, comment: string) => {
    const promptExists = await prisma.prompt.findUnique({
        where: { id: promptId }
    });

    if (!promptExists) {
        throw new Error('Prompt not found');
    }

    return await prisma.comment.create({
        data: {
            comment: comment,
            promptId: promptId,
            userId: userId
        },
        include: {
            user: {
                select: { id: true, username: true } 
            }
        }
    });
};