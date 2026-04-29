import { prisma } from '../lib/prisma';

// CREATE rating - COM VALIDAÇÃO PRÉVIA
export const createRating = async (data: {
    score: number;
    userId: number;
    promptId: number;
}) => {
    // Validar se o prompt existe
    const promptExists = await prisma.prompt.findUnique({
        where: { id: data.promptId }
    });
    
    if (!promptExists) {
        throw new Error('Prompt not found');
    }
    
    // Validar se o utilizador existe
    const userExists = await prisma.user.findUnique({
        where: { id: data.userId }
    });
    
    if (!userExists) {
        throw new Error('User not found');
    }
    
    // Verificar se já existe avaliação
    const existingRating = await prisma.eval.findUnique({
        where: {
            userId_promptId: {
                userId: data.userId,
                promptId: data.promptId
            }
        }
    });
    
    if (existingRating) {
        throw new Error('Rating already exists for this user and prompt');
    }

    return await prisma.eval.create({
        data: {
            score: data.score,
            userId: data.userId,
            promptId: data.promptId,
        },
        include: {
            user: {
                select: { id: true, username: true }
            },
        }
    });
};

// UPDATE Rating
export const updateRating = async (promptId: number, userId: number, score: number) => {
    const evalExists = await prisma.eval.findUnique({
        where: { 
            userId_promptId: {
                userId,
                promptId
            }
        }
    });

    if (!evalExists) {
        throw new Error('Rating not found');
    }

    return await prisma.eval.update({
        where: {
            userId_promptId: {
                userId,
                promptId
            }
        },
        data: { score },
        include: {
            user: { select: { id: true, username: true } }
        }
    });
};

// DELETE rating 
export const deleteRating = async (promptId: number, userId: number) => {
    const evalExists = await prisma.eval.findUnique({
        where: { 
            userId_promptId: { userId, promptId }
        }
    });

    if (!evalExists) {
        throw new Error('Rating not found');
    }

    return await prisma.eval.delete({
        where: { userId_promptId: { userId, promptId } }
    });
};

// DELETE rating para admins
export const adminDeleteRating = async (id: number) => {
    const ratingExists = await prisma.eval.findUnique({
        where: { id }
    });
    
    if (!ratingExists) {
        throw new Error('Rating not found');
    }
    
    return await prisma.eval.delete({
        where: { id }
    });
};