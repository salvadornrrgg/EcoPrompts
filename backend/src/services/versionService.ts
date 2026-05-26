import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';

export const findVersionsByPromptId = async (promptId: number) => {
    const promptExists = await prisma.prompt.findUnique({ where: { id: promptId } });

    if (!promptExists) {
        logger.warn(`Prompt não encontrado ao buscar versões: id=${promptId}`);
        throw new Error('Prompt not found');
    }

    return await prisma.version.findMany({
        where: { promptId },
        include: {
            user: { select: { id: true, username: true } },
            prompt: { select: { id: true, title: true } }
        },
        orderBy: { versionNumber: 'asc' }
    });
};

export const findVersionById = async (id: number) => {
    const version = await prisma.version.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, username: true } },
            prompt: {
                include: {
                    user: { select: { id: true, username: true } },
                    category: true
                }
            }
        }
    });

    if (!version) {
        logger.warn(`Versão não encontrada: id=${id}`);
        throw new Error('Version not found');
    }

    return version;
};

export const createVersion = async (promptId: number, userId: number, data: {
    promptText: string;
    improvements?: string;
    rating?: number;
}) => {
    const promptExists = await prisma.prompt.findUnique({ where: { id: promptId } });
    if (!promptExists) {
        logger.warn(`Prompt não encontrado ao criar versão: id=${promptId}`);
        throw new Error('Prompt not found');
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        logger.warn(`Utilizador não encontrado ao criar versão: id=${userId}`);
        throw new Error('User not found');
    }

    const versionsCount = await prisma.version.count({ where: { promptId } });
    const nextVersionNumber = versionsCount + 1;

    const version = await prisma.version.create({
        data: {
            versionNumber: nextVersionNumber,
            promptText: data.promptText,
            improvements: data.improvements,
            rating: data.rating || 0,
            promptId,
            userId
        },
        include: {
            user: { select: { id: true, username: true } },
            prompt: { select: { id: true, title: true } }
        }
    });

    logger.info(`Versão criada: v${nextVersionNumber} para prompt=${promptId} por user=${userId}`);
    return version;
};

export const deleteVersion = async (id: number) => {
    const versionExists = await prisma.version.findUnique({ where: { id } });

    if (!versionExists) {
        logger.warn(`Versão não encontrada ao apagar: id=${id}`);
        throw new Error('Version not found');
    }

    const deleted = await prisma.version.delete({ where: { id } });
    logger.info(`Versão apagada: id=${id}`);
    return deleted;
};
