import { prisma } from '../lib/prisma.js';

// CREATE rating
export const createRating = async (data: {
    score: number;
    userId: number;
    promptId: number;
    
}) => {
    return await prisma.eval.create({
        data: {
            score: data.score,
            userId: data.userId ,
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
    return await prisma.eval.delete({
        where: { id }
    });
};



