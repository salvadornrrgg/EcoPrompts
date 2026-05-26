import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';

export const createRating = async (data: { score: number; userId: number; promptId: number }) => {
    const promptExists = await prisma.prompt.findUnique({ where: { id: data.promptId } });
    if (!promptExists) {
        logger.warn(`Prompt não encontrado ao criar avaliação: id=${data.promptId}`);
        throw new Error('Prompt not found');
    }

    const userExists = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!userExists) {
        logger.warn(`Utilizador não encontrado ao criar avaliação: id=${data.userId}`);
        throw new Error('User not found');
    }

    const existingRating = await prisma.eval.findUnique({
        where: { userId_promptId: { userId: data.userId, promptId: data.promptId } }
    });
    if (existingRating) {
        logger.warn(`Avaliação já existe: user=${data.userId} prompt=${data.promptId}`);
        throw new Error('Rating already exists for this user and prompt');
    }

    const rating = await prisma.eval.create({
        data: { score: data.score, userId: data.userId, promptId: data.promptId },
        include: { user: { select: { id: true, username: true } } }
    });

    logger.info(`Avaliação criada: prompt=${data.promptId} por user=${data.userId} score=${data.score}`);
    return rating;
};

export const updateRating = async (promptId: number, userId: number, score: number) => {
    const evalExists = await prisma.eval.findUnique({
        where: { userId_promptId: { userId, promptId } }
    });
    if (!evalExists) {
        logger.warn(`Avaliação não encontrada ao atualizar: user=${userId} prompt=${promptId}`);
        throw new Error('Rating not found');
    }

    const updated = await prisma.eval.update({
        where: { userId_promptId: { userId, promptId } },
        data: { score },
        include: { user: { select: { id: true, username: true } } }
    });

    logger.info(`Avaliação atualizada: prompt=${promptId} por user=${userId} novo score=${score}`);
    return updated;
};

export const deleteRating = async (promptId: number, userId: number) => {
    const evalExists = await prisma.eval.findUnique({
        where: { userId_promptId: { userId, promptId } }
    });
    if (!evalExists) {
        logger.warn(`Avaliação não encontrada ao apagar: user=${userId} prompt=${promptId}`);
        throw new Error('Rating not found');
    }

    const deleted = await prisma.eval.delete({ where: { userId_promptId: { userId, promptId } } });
    logger.info(`Avaliação apagada: prompt=${promptId} por user=${userId}`);
    return deleted;
};

export const adminDeleteRating = async (id: number) => {
    const ratingExists = await prisma.eval.findUnique({ where: { id } });
    if (!ratingExists) {
        logger.warn(`Avaliação não encontrada ao apagar (admin): id=${id}`);
        throw new Error('Rating not found');
    }

    const deleted = await prisma.eval.delete({ where: { id } });
    logger.info(`Avaliação apagada por admin: id=${id}`);
    return deleted;
};
